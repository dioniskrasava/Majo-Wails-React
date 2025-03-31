package engwords

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3" // Драйвер SQLite
)

func WriteAndRead() {
	// 1. Открываем CSV файл
	csvFile, err := os.Open("data.csv")
	if err != nil {
		log.Fatal("Не удалось открыть CSV файл:", err)
	}
	defer csvFile.Close()

	// 2. Создаем CSV reader
	reader := csv.NewReader(csvFile)
	reader.Comma = ','         // Указываем разделитель
	reader.FieldsPerRecord = 4 // Ожидаем 4 поля в каждой записи

	// 3. Читаем все записи (пропускаем первую строку, если это заголовок)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal("Ошибка чтения CSV:", err)
	}

	// 4. Создаем/открываем базу данных SQLite
	db, err := sql.Open("sqlite3", "./vocabulary.db")
	if err != nil {
		log.Fatal("Не удалось открыть базу данных:", err)
	}
	defer db.Close()

	// 5. Создаем таблицу, если она не существует
	createTableSQL := `CREATE TABLE IF NOT EXISTS words (
		id INTEGER PRIMARY KEY,
		english TEXT NOT NULL,
		translate TEXT NOT NULL,
		guessing INTEGER DEFAULT 0
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatal("Ошибка при создании таблицы:", err)
	}

	// 6. Подготавливаем SQL запрос для вставки данных
	stmt, err := db.Prepare("INSERT INTO words(id, english, translate, guessing) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Fatal("Ошибка подготовки запроса:", err)
	}
	defer stmt.Close()

	// 7. Обрабатываем записи из CSV
	for i, record := range records {
		// Пропускаем заголовок, если он есть (первая строка)
		if i == 0 {
			continue
		}

		// Парсим данные из CSV
		id, err := strconv.Atoi(record[0])
		if err != nil {
			log.Printf("Ошибка преобразования ID в строке %d: %v\n", i, err)
			continue
		}

		english := record[1]
		translate := record[2]

		guessing, err := strconv.Atoi(record[3])
		if err != nil {
			log.Printf("Ошибка преобразования guessing в строке %d: %v\n", i, err)
			guessing = 0 // Устанавливаем значение по умолчанию
		}

		// Вставляем данные в базу
		_, err = stmt.Exec(id, english, translate, guessing)
		if err != nil {
			log.Printf("Ошибка вставки записи %d: %v\n", i, err)
			continue
		}
	}

	fmt.Println("Данные успешно импортированы в SQLite базу данных")
}
