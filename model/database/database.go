// model/database/database.go
package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// Создание таблицы test_data (приложения EDR)
func createTestDataTable(db *sql.DB) {
	query := `
    CREATE TABLE IF NOT EXISTS test_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT
    );`
	_, err := db.Exec(query)
	if err != nil {
		log.Fatalf("Ошибка при создании таблицы test_data: %v", err)
	}
}

func InitDBAndAddActivity(activityType, begintime, endtime, totaltime, comment string) {

	db := createDB() // создаем бд если не создана
	defer db.Close() // закрываем после выполнения этой ф-ии

	createTableActivityInDB(db) // создаем таблицу активностей (если не создана)

	// добавляем активность в бд
	addActivity(db, activityType, begintime, endtime, totaltime, comment)
}

func createDB() (db *sql.DB) {
	// Подключение к базе данных SQLite
	db, err := sql.Open("sqlite3", "./activities.db")
	if err != nil {
		log.Fatal(err)
	}

	return db

}

func createTableActivityInDB(db *sql.DB) {

	// Создание таблицы, если она не существует
	createTableSQL := `CREATE TABLE IF NOT EXISTS activities (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	type TEXT,
	start_time TEXT,
	end_time TEXT,
	total_time TEXT,
	comment TEXT
);`
	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Fatal(err)
	}
}

func addActivity(db *sql.DB, activityType, begintime, endtime, totaltime, comment string) {
	// Вставка данных в базу данных
	insertSQL := `INSERT INTO activities (type, start_time, end_time, total_time, comment) VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(insertSQL, activityType, begintime, endtime, totaltime, comment)
	if err != nil {
		log.Fatal(err)
	}
}
