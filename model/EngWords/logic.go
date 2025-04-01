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

func openDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./vocabulary.db")
	if err != nil {
		log.Fatal(err)
	}
	return db
}

// получает из JS правильность ответа и id
func CheckAnswer(answer bool, id int) {
	if answer {
		incGuessing(id)
	}
}

// увеличивает количество угадываний слова в БД
func incGuessing(id int) {

}

// отдает в JS массив ВСЕЙ необходимой информации
// слово, 6 вариантов ответов, правильный вариант ответа
func GetAnswers() []string {

	db := openDB()
	defer db.Close()

	// Получаем случайное слово
	word, err := GetRandomWord(db)
	if err != nil {
		log.Fatal(err)
	}

	// получаем id правильного ответа
	id := word.ID

	// получаем неправильные ответы 5 штук
	wrongAnswers := getWrongAnswers(db, id)
	// собираем ответы в случайном порядке. получаем 6 ответов и индекс правильного
	answers, corrAnsInd := assemblingAnswers(word.Translate, wrongAnswers)
	// преобразуем индекс правильного ответа в строку
	corrAnsIndString := fmt.Sprintf("%d", corrAnsInd)

	// преобразуем id в строку
	idStr := fmt.Sprintf("%d", id)

	// возвращаемый формат:
	// слово, его ID, 6 вариантов ответов, индекс правильного ответа (с нуля)
	return []string{word.English, idStr, answers[0], answers[1], answers[2], answers[3], answers[4], answers[5], corrAnsIndString}
}

// возвращает 5 неправильных вариантов ответов
// параметр id нужен для того, чтобы варианты не совпадали с правильным
func getWrongAnswers(db *sql.DB, id int) []string {
	quantityAnswers := 0
	complectAnswers := []string{}
	for {
		//если насобирали 5 вариантов ответов - завершаем
		if quantityAnswers == 5 {
			break
		}

		// получаем слово
		word, err := GetRandomWord(db)
		if err != nil {
			log.Fatal(err)
		}

		// сравниваем его с правильным
		// если это то же слово, то завершаем итерацию цикла
		if word.ID == id {
			continue
		}

		// добавляем неправильный вариант ответа в срез
		complectAnswers = append(complectAnswers, word.Translate)
		// увеличиваем значение количества на 1
		quantityAnswers++
	}

	fmt.Println("ПОЛУЧИЛИ ГРУППУ ОТВЕТОВ : ", complectAnswers)

	return complectAnswers
}

// принимает правильный ответ и 5 неправильных
// возвращает массив ответов в случайном порядке с индексом правильного ответа (индекс с 0)
func assemblingAnswers(correct string, wrong []string) (answers []string, indexCorrect int) {

	if len(wrong) != 5 {
		panic("wrong must contain exactly 5 elements")
	}

	// Создаём локальный генератор случайных чисел
	r := rand.New(rand.NewSource(time.Now().UnixNano())) // или другой seed

	answers = make([]string, 6)
	indexCorrect = r.Intn(6) // Используем локальный генератор

	// Заполняем answers
	j := 0 // Индекс для wrong
	for i := 0; i < 6; i++ {
		if i == indexCorrect {
			answers[i] = correct
		} else {
			answers[i] = wrong[j]
			j++
		}
	}

	return answers, indexCorrect
}
