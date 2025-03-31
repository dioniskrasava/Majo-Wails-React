package engwords

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Word представляет структуру записи из базы данных
type Word struct {
	ID        int
	English   string
	Translate string
	Guessing  int
}

// GetRandomWord возвращает случайную запись из базы данных
func GetRandomWord(db *sql.DB) (Word, error) {
	var word Word

	// Сначала узнаем общее количество записей
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM words").Scan(&count)
	if err != nil {
		return word, fmt.Errorf("ошибка при получении количества записей: %v", err)
	}

	if count == 0 {
		return word, fmt.Errorf("база данных пуста")
	}

	// Генерируем случайный ID в диапазоне от 1 до count
	rand.Seed(time.Now().UnixNano())
	randomID := rand.Intn(count) + 1

	// Получаем запись с этим ID
	err = db.QueryRow("SELECT id, english, translate, guessing FROM words WHERE id = ?", randomID).Scan(
		&word.ID,
		&word.English,
		&word.Translate,
		&word.Guessing,
	)

	if err != nil {
		return word, fmt.Errorf("ошибка при получении случайной записи: %v", err)
	}

	return word, nil
}

//
/*
Альтернативный вариант (более эффективный для больших таблиц):

Если в вашей таблице много записей и есть пропуски в ID, можно использовать более оптимальный запрос:
*/
func GetRandomWord2(db *sql.DB) (Word, error) {
	var word Word

	// Используем ORDER BY RANDOM() LIMIT 1 для получения случайной записи
	err := db.QueryRow("SELECT id, english, translate, guessing FROM words ORDER BY RANDOM() LIMIT 1").Scan(
		&word.ID,
		&word.English,
		&word.Translate,
		&word.Guessing,
	)

	if err != nil {
		return word, fmt.Errorf("ошибка при получении случайной записи: %v", err)
	}

	return word, nil
}

func NewApp() string {
	// Открываем базу данных
	db, err := sql.Open("sqlite3", "./vocabulary.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Получаем случайное слово
	word, err := GetRandomWord(db)
	if err != nil {
		log.Fatal(err)
	}

	// Выводим результат
	fmt.Printf("Случайное слово:\nID: %d\nEnglish: %s\nTranslate: %s\nGuessing: %d\n",
		word.ID, word.English, word.Translate, word.Guessing)

	wordEnglish := word.English

	return wordEnglish
}
