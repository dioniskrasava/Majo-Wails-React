// app.go
package main

import (
	"Majo-Wails-React/model/database"
	"context"
	"database/sql"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var WIDTH int = 750
var HEIGHT int = 550

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

// Вспомогательная ф-я для изменения размера окна
func (a *App) ResizeWindow(width int, height int) {
	// Проверяем, что контекст действителен
	if a.ctx == nil {
		return
	}
	runtime.WindowSetSize(a.ctx, width, height)
}

func (a *App) GetWindowSize() (int, int) {
	width, height := runtime.WindowGetSize(a.ctx)
	return width, height
}

// ф-я вызываемая из js
func (a *App) SetSettings(command string, parametr int) {
	if command == "WIDTH" {
		// получаем фактическое значения размеров окна
		_, heigFact := a.GetWindowSize()
		WIDTH = parametr
		a.ResizeWindow(parametr, heigFact)
		fmt.Println("WINDOWS SIZE ---> ", WIDTH, heigFact)
	} else if command == "HEIGHT" {
		// получаем фактическое значения размеров окна
		widthFact, _ := a.GetWindowSize()
		HEIGHT = parametr
		a.ResizeWindow(widthFact, parametr)
		fmt.Println("WINDOWS SIZE ---> ", widthFact, HEIGHT)
	}

}

// GetTestData возвращает тестовые данные из базы данных
func (a *App) GetTestData() ([]map[string]interface{}, error) {
	rows, err := a.db.Query("SELECT id, first_name, last_name, age FROM test_data")
	if err != nil {
		return nil, fmt.Errorf("ошибка при загрузке данных: %v", err)
	}
	defer rows.Close()

	var data []map[string]interface{}
	for rows.Next() {
		var id int
		var firstName, lastName string
		var age int
		if err := rows.Scan(&id, &firstName, &lastName, &age); err != nil {
			return nil, fmt.Errorf("ошибка при сканировании данных: %v", err)
		}
		data = append(data, map[string]interface{}{
			"id":        id,
			"firstName": firstName,
			"lastName":  lastName,
			"age":       age,
		})
	}

	return data, nil
}

// AddTestData добавляет строку в таблицу test_data (EDR)
func (a *App) AddTestData(firstName, lastName string, age int) error {
	query := `INSERT INTO test_data (first_name, last_name, age) VALUES (?, ?, ?)`
	_, err := a.db.Exec(query, firstName, lastName, age)
	if err != nil {
		return fmt.Errorf("ошибка при добавлении данных в таблицу test_data: %v", err)
	}
	return nil
}

// UpdateCellValue обновляет значение ячейки в таблице test_data
func (a *App) UpdateCellValue(id int, columnName string, newValue string) error {
	// Проверяем, что columnName соответствует допустимым столбцам
	validColumns := map[string]bool{
		"first_name": true,
		"last_name":  true,
		"age":        true,
	}

	fmt.Printf("Полученное имя столбца: %s\n", columnName) // Отладка
	fmt.Printf("Допустимые столбцы: %v\n", validColumns)   // Отладка

	if !validColumns[columnName] {
		return fmt.Errorf("недопустимое имя столбца: %s", columnName)
	}

	// Формируем SQL-запрос
	query := fmt.Sprintf("UPDATE test_data SET %s = ? WHERE id = ?", columnName)
	_, err := a.db.Exec(query, newValue, id)
	if err != nil {
		return fmt.Errorf("ошибка при обновлении ячейки: %v", err)
	}
	return nil
}

// EDR
func (a *App) DeleteRow(id int) error {
	query := `DELETE FROM test_data WHERE id = ?`
	_, err := a.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("ошибка при удалении строки: %v", err)
	}
	return nil
}
