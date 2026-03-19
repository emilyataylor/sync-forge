package jobs

type Job struct {
	ID            string `json:"id"`
	IntegrationID string `json:"integrationId"`
	Status        string `json:"status"`
	Attempt       int    `json:"attempt"`
	MaxAttempts   int    `json:"maxAttempts"`
	CreatedAt     string `json:"createdAt"`
}
