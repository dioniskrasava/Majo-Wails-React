package main

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Activity представляет запись активности
type Activity struct {
	ID        int
	Type      string
	StartTime string
	EndTime   string
	TotalTime string
	Comment   string
	CreatedAt time.Time
}

// InitDB инициализирует базу данных SQLite
func InitDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./activities.db")
	if err != nil {
		return nil, fmt.Errorf("ошибка при открытии базы данных: %v", err)
	}

	// Создаем таблицу, если она не существует
	query := `
    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        total_time TEXT NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
	_, err = db.Exec(query)
	if err != nil {
		return nil, fmt.Errorf("ошибка при создании таблицы: %v", err)
	}

	return db, nil
}

// AddActivity добавляет активность в базу данных
func AddActivity(db *sql.DB, activity Activity) error {
	query := `
    INSERT INTO activities (type, start_time, end_time, total_time, comment)
    VALUES (?, ?, ?, ?, ?);`
	_, err := db.Exec(query, activity.Type, activity.StartTime, activity.EndTime, activity.TotalTime, activity.Comment)
	if err != nil {
		return fmt.Errorf("ошибка при добавлении активности: %v", err)
	}
	return nil
}

// SaveActivity сохраняет активность в базе данных
func (a *App) SaveActivity(activityType, startTime, endTime, totalTime, comment string) (string, error) {
	activity := Activity{
		Type:      activityType,
		StartTime: startTime,
		EndTime:   endTime,
		TotalTime: totalTime,
		Comment:   comment,
	}

	err := AddActivity(a.db, activity)
	if err != nil {
		return "", fmt.Errorf("ошибка при сохранении активности: %v", err)
	}

	return "Активность успешно добавлена!", nil
}
