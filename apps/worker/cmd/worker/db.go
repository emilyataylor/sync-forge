package main

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

var db *pgx.Conn

func connectDB() error {
	var err error
	db, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	return err
}