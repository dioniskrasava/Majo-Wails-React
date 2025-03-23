// model/database/database.go
package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

/*
// InitDBWithTestData инициализирует базу данных и добавляет тестовые данные, если их нет (EDR)
func InitDBWithTestData() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./activities.db")
	if err != nil {
		return nil, err
	}

	// Создаем таблицу, если она не существует
	createTableSQL := `CREATE TABLE IF NOT EXISTS test_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT,
		last_name TEXT,
		age INTEGER
	);`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, err
	}

	// Проверяем, есть ли уже тестовые данные
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM test_data").Scan(&count)
	if err != nil {
		return nil, err
	}

	// Если данных нет, добавляем тестовые данные
	if count == 0 {
		insertSQL := `INSERT INTO test_data (first_name, last_name, age) VALUES
			('John', 'Doe', 30),
			('Jane', 'Smith', 25),
			('Bob', 'Johnson', 40);`
		_, err = db.Exec(insertSQL)
		if err != nil {
			return nil, err
		}
	}

	return db, nil
}*/

// Создание таблицы test_data
func createTestDataTable(db *sql.DB) {
	query := `
	CREATE TABLE IF NOT EXISTS test_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT,
		last_name TEXT,
		age INTEGER
	);`
	_, err := db.Exec(query)
	if err != nil {
		log.Fatalf("Ошибка при создании таблицы test_data: %v", err)
	}

	// Проверяем, есть ли данные в таблице
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM test_data").Scan(&count)
	if err != nil {
		log.Fatalf("Ошибка при проверке данных в таблице test_data: %v", err)
	}

	// Если данных нет, добавляем тестовые данные
	if count == 0 {
		insertSQL := `INSERT INTO test_data (first_name, last_name, age) VALUES 
			('John', 'Doe', 30),
			('Jane', 'Smith', 25),
			('Bob', 'Johnson', 40);`
		_, err = db.Exec(insertSQL)
		if err != nil {
			log.Fatalf("Ошибка при добавлении тестовых данных: %v", err)
		}
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
