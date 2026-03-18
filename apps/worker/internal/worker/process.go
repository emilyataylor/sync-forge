package worker

import (
	"log"
	"time"

	"syncforge/worker/internal/jobs"
)

func processJob(job jobs.Job) {
	log.Println("[Worker] Simulating API call for:", job.IntegrationID)

	time.Sleep(2 * time.Second)

	log.Println("[Worker] Completed job:", job.IntegrationID)
}