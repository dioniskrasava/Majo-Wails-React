package main

import (
	engwords "Majo-Wails-React/model/EngWords"
	"fmt"
)

//=============================================================
//
// для ENGLISH WORDS  wrappers
//
//=============================================================

// GetButtonNames возвращает массив названий для кнопок
func (a *App) GetButtonNames() []string {
	return engwords.GetButtonNames()
}

func (a *App) SayHello(buttonIndex int) {
	fmt.Println("Hello, eng-wo. ", buttonIndex, " !")
}

func (a *App) WriteAndRead() {
	engwords.WriteAndRead()
}

func (a *App) GetRandomRow() string {
	return engwords.NewApp() //для теста в консоль
}
