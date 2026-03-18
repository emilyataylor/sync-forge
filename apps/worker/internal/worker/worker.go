package worker

import (
	"context"
	"encoding/json"
	"log"

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

		processJob(job)
	}
}