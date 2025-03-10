package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app, err := NewApp()
	if err != nil {
		log.Fatalf("Ошибка при инициализации приложения: %v", err)
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "Majo-Wails-React",
		Width:     600,
		Height:    400,
		MinWidth:  500, // Минимальная ширина окна
		MinHeight: 300, // Минимальная высота окна
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
