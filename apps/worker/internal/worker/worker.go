package worker

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"syncforge/worker/internal/jobs"

	"github.com/redis/go-redis/v9"
)

func Start(client *redis.Client) {
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

		err = processJob(job)

		if err != nil {
			log.Println("[Worker] Job failed:", job.IntegrationID, "Attempt:", job.Attempt)

			if job.Attempt < job.MaxAttempts {
				job.Attempt++

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

				// dead letter queue for permanently failed jobs
				updatedJobJSON, _ := json.Marshal(job)
				client.LPush(ctx, "failed-jobs", updatedJobJSON)
			}

			continue
		}
	}
}