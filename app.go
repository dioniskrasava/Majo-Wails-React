package main

import (
	"context"
	"database/sql" // Импорт пакета для работы с SQL
	"fmt"

	_ "github.com/mattn/go-sqlite3" // Драйвер для SQLite
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() (*App, error) {
	db, err := InitDB()
	if err != nil {
		return nil, err
	}
	return &App{db: db}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
