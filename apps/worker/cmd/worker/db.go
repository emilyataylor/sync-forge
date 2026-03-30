package main

import (
	"context"
	_ "embed"
	"os"

	"github.com/jackc/pgx/v5"
)

var db *pgx.Conn

//go:embed schema.sql
var schemaSQL string

func connectDB() error {
	var err error
	db, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	return err
}

func ensureSchema() error {
	_, err := db.Exec(context.Background(), schemaSQL)
	return err
}