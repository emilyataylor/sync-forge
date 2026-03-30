package worker

import (
	"context"

	"syncforge/worker/internal/jobs"

	"github.com/jackc/pgx/v5"
)

func updateJobStatus(db *pgx.Conn, job jobs.Job) {
	ctx := context.Background()

	_, _ = db.Exec(
		ctx,
		`UPDATE jobs
		 SET status = $2, attempts = $3, max_attempts = $4, updated_at = NOW()
		 WHERE id = $1`,
		job.ID,
		job.Status,
		job.Attempt,
		job.MaxAttempts,
	)
}

func insertJobLog(db *pgx.Conn, jobID string, level string, message string) {
	_, _ = db.Exec(
		context.Background(),
		`INSERT INTO logs (job_id, message, level) VALUES ($1, $2, $3)`,
		jobID,
		message,
		level,
	)
}