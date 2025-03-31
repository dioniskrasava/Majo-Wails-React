// app.go
package main

import (
	engwords "Majo-Wails-React/model/EngWords"
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

// ф-я вызываемая из js ТЕСТОВАЯ ДЛЯ ИЗМЕНЕНИЯ РАЗМЕРОВ ОКНА
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

//=============================================================
//
// для ENGLISH WORDS
//
//=============================================================

// GetButtonNames возвращает массив названий для кнопок
func (a *App) GetButtonNames() []string {
	return engwords.GetButtonNames()
}
