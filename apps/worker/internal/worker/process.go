package worker

import (
	"errors"
	"log"
	"math/rand"
	"time"

	"syncforge/worker/internal/jobs"
)

func processJob(job jobs.Job) error {
	log.Println("[Worker] Processing job:", job.IntegrationID)

	time.Sleep(2 * time.Second)

	// Simulate failure
	if rand.Intn(3) == 0 {
		return errors.New("simulated API failure")
	}

	log.Println("[Worker] Completed job:", job.IntegrationID)
	return nil
}