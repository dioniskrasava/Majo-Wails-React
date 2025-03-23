// model/database/categorydb.go
package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// Инициализация базы данных
func InitDB() (*sql.DB, error) {
	db := createDB()
	createCategoryTable(db)     // создаем таблицу категорий активностей (если не создана)
	createTableActivityInDB(db) // создаем таблицу активностей (если не создана)
	createTestDataTable(db)     // создаем таблицу test_data (если не создана)

	return db, nil
}

func createCategoryTable(db *sql.DB) {
	// Создаём таблицу categories, если её нет
	query := `
	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE
);
`
	_, err := db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}

// Сохраняет новую категорию в базу данных
func SaveCategory(db *sql.DB, name string) error {
	query := `INSERT INTO categories (name) VALUES (?)`
	_, err := db.Exec(query, name)
	if err != nil {
		return fmt.Errorf("ошибка при сохранении категории: %v", err)
	}
	return nil
}

// Загружает все категории из базы данных
func LoadCategories(db *sql.DB) ([]string, error) {
	query := `SELECT name FROM categories`
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("ошибка при загрузке категорий: %v", err)
	}
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, fmt.Errorf("ошибка при сканировании категории: %v", err)
		}
		categories = append(categories, name)
	}

	// Если категорий нет, возвращаем пустой список
	if categories == nil {
		return []string{}, nil
	}

	return categories, nil
}
