package main

import (
	"Majo-Wails-React/model/database"
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	db, err := database.InitDB()
	if err != nil {
		log.Fatalf("Ошибка при инициализации базы данных: %v", err)
	}
	defer db.Close()

	// Create an instance of the app structure
	app := NewApp(db)

	// Загрузка категорий при запуске
	categories, err := app.LoadCategories()
	if err != nil {
		log.Fatalf("Ошибка при загрузке категорий: %v", err)
	}
	log.Printf("Загружены категории: %v", categories)

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "Majo-Wails-React",
		Width:     670,
		Height:    500,
		MinWidth:  595, // Минимальная ширина окна
		MinHeight: 430, // Минимальная высота окна
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app, // Здесь происходит привязка методов
			// В этом срезе вы передаете экземпляры структур,
			// методы которых хотите сделать доступными для фронтенда.

			// Все экспортируемые методы (с большой буквы) структуры App
			// автоматически становятся доступными для вызова из JavaScript.

			/*Привязка к фронтенду: Wails автоматически создает прокси-объект
			в JavaScript, который позволяет вызывать методы Go из фронтенда.
			Этот объект доступен через window.go.main.App.*/
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
