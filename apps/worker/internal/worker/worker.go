package worker

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"syncforge/worker/internal/jobs"

	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

func Start(client *redis.Client, db *pgx.Conn) {
	ctx := context.Background()

	log.Println("[Worker] Started")

	for {
		result, err := client.BRPop(ctx, 0, "integration-jobs").Result()
		if err != nil {
			log.Println("[Worker] Error fetching job:", err)
			continue
		}

		jobData := result[1]

		var job jobs.Job
		err = json.Unmarshal([]byte(jobData), &job)
		if err != nil {
			log.Println("[Worker] Failed to parse job:", err)
			continue
		}

		log.Println("[Worker] Processing job:", job.IntegrationID)
		insertJobLog(db, job.ID, "INFO", "Worker picked up job")

		job.Status = jobs.StatusProcessing
		updateJobStatus(db, job)

		err = processJob(job)

		if err != nil {
			log.Println("[Worker] Job failed:", job.IntegrationID, "Attempt:", job.Attempt)
			insertJobLog(db, job.ID, "ERROR", err.Error())

			if job.Attempt < job.MaxAttempts {
				job.Attempt++

				job.Status = jobs.StatusPending

				updateJobStatus(db, job)

				// Exponential backoff to avoid instant retries
				delay := time.Duration(1<<job.Attempt) * time.Second
				log.Println("[Worker] Backing off for:", delay)

				time.Sleep(delay)

				log.Println("[Worker] Retrying job:", job.IntegrationID, "Next attempt:", job.Attempt)

				// Requeue job
				updatedJobJSON, _ := json.Marshal(job)
				client.LPush(ctx, "integration-jobs", updatedJobJSON)

			} else {
				log.Println("[Worker] Job permanently failed:", job.IntegrationID)

				job.Status = jobs.StatusFailed
				updateJobStatus(db, job)
				insertJobLog(db, job.ID, "ERROR", "Job permanently failed")

				// dead letter queue for permanently failed jobs
				updatedJobJSON, _ := json.Marshal(job)
				client.LPush(ctx, "failed-jobs", updatedJobJSON)
			}

			continue
		}

		job.Status = jobs.StatusCompleted
		updateJobStatus(db, job)
		insertJobLog(db, job.ID, "INFO", "Job completed successfully")
	}
}