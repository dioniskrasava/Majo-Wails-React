package main

import (
	"Majo-Wails-React/model/database"
	"context"
	"database/sql"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp создаёт новое приложение
func NewApp(db *sql.DB) *App {
	return &App{db: db}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// New method to print "Hello World" to the console
func (a *App) AddActivityWithDB(activityType, begintime, endtime, totaltime, comment string) {
	fmt.Println("Комментарий из React:", activityType, begintime, endtime, totaltime, comment)
	database.InitDBAndAddActivity(activityType, begintime, endtime, totaltime, comment)
}

// Загружает категории из базы данных
func (a *App) LoadCategories() ([]string, error) {
	return database.LoadCategories(a.db)
}

// Сохраняет новую категорию в базу данных
func (a *App) SaveCategory(name string) error {
	return database.SaveCategory(a.db, name)
}
