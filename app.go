package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// New method to print "Hello World" to the console
func (a *App) PrintHelloWorld(activityType, begintime, endtime, totaltime, comment string) {
	fmt.Println("Комментарий из React:", activityType, begintime, endtime, totaltime, comment)
}
