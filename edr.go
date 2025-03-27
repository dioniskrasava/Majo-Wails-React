// edr.go
// пакет функций для работы с EVERY DAY ROUTINE
package main

import (
	"Majo-Wails-React/model/edr"
	"fmt"
)

// GetTableData возвращает все данные из указанной таблицы
func (a *App) GetTableData(tableName string) ([]map[string]interface{}, error) {
	return edr.GetTableData(a.db, tableName)
}

// GetTestData возвращает тестовые данные из таблицы test_data
func (a *App) GetTestData() ([]map[string]interface{}, error) {
	return edr.GetTestData(a.db)
}

// AddTestData добавляет запись в таблицу test_data
func (a *App) AddTestData(firstName, lastName string, age interface{}) error {
	return edr.AddTestData(a.db, firstName, lastName, age)
}

// AddColumn добавляет новый столбец в указанную таблицу/
func (a *App) AddColumn(tableName, columnName, columnType string) error {
	return edr.AddColumn(a.db, tableName, columnName, columnType)
}

// UpdateCellValue обновляет значение ячейки в таблице test_data
func (a *App) UpdateCellValue(id int, columnName string, value interface{}) error {
	// Проверяем существование столбца
	exists, err := edr.ColumnExists(a.db, "test_data", columnName)
	if err != nil {
		return fmt.Errorf("проверка столбца: %v", err)
	}
	if !exists {
		return fmt.Errorf("столбец %s не существует", columnName)
	}

	query := fmt.Sprintf("UPDATE test_data SET %s = ? WHERE id = ?", columnName)
	_, err = a.db.Exec(query, value, id)
	return err
}

// DeleteRow удаляет строку из таблицы test_data
func (a *App) DeleteRow(id int) error {
	return edr.DeleteRow(a.db, "test_data", id)
}

// GetColumnNames возвращает пользовательские названия столбцов
func (a *App) GetColumnNames(tableName string) (map[string]string, error) {
	return edr.GetColumnNames(a.db, tableName)
}

// UpdateColumnName обновляет отображаемое имя столбца
func (a *App) UpdateColumnName(columnName, newDisplayName string) error {
	return edr.UpdateColumnName(a.db, columnName, newDisplayName)
}

// AddEmptyRow добавляет пустую строку в указанную таблицу
func (a *App) AddEmptyRow(tableName string) error {
	return edr.AddEmptyRow(a.db, tableName)
}

// ColumnExists проверяет существование столбца (новая обертка)
func (a *App) ColumnExists(tableName, columnName string) (bool, error) {
	return edr.ColumnExists(a.db, tableName, columnName)
}
