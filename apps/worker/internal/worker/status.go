package worker

import (
	"context"
	"encoding/json"

	"syncforge/worker/internal/jobs"

	"github.com/redis/go-redis/v9"
)

func updateJobStatus(client *redis.Client, job jobs.Job) {
	ctx := context.Background()

	data, _ := json.Marshal(job)
	client.Set(ctx, "job:"+job.ID, data, 0)
}