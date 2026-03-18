package jobs

type Job struct {
	IntegrationID string `json:"integrationId"`
	Attempt       int    `json:"attempt"`
	MaxAttempts   int    `json:"maxAttempts"`
}