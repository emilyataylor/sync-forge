package jobs

type Status string

const (
	StatusPending    Status = "PENDING"
	StatusProcessing Status = "PROCESSING"
	StatusCompleted  Status = "COMPLETED"
	StatusFailed     Status = "FAILED"
)

type Job struct {
	ID            string `json:"id"`
	IntegrationID string `json:"integrationId"`
	Status        Status `json:"status"`
	Attempt       int    `json:"attempt"`
	MaxAttempts   int    `json:"maxAttempts"`
	CreatedAt     string `json:"createdAt"`
}
