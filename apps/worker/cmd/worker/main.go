package main

import (
	"log"

	"syncforge/worker/internal/queue"
	"syncforge/worker/internal/worker"

	"github.com/joho/godotenv"
)

func main() {
	// Load env
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	// Connect DB
	err = connectDB()
	if err != nil {
		log.Fatal(err)
	}

	err = ensureSchema()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to Postgres")
	
	client := queue.NewRedisClient()

	log.Println("Starting SyncForge Worker...")

	worker.Start(client, db)
}