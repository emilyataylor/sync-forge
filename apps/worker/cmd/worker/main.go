package main

import (
	"log"

	"syncforge/worker/internal/queue"
	"syncforge/worker/internal/worker"
)

func main() {
	client := queue.NewRedisClient()

	log.Println("Starting SyncForge Worker...")

	worker.Start(client)
}