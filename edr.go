// edr.go
// пакет функций для работы с EVERY DAY ROUTINE
package main

import "fmt"

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

// DeleteRow - удаляет строку из таблицы
func (a *App) DeleteRow(id int) error {
	query := `DELETE FROM test_data WHERE id = ?`
	_, err := a.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("ошибка при удалении строки: %v", err)
	}
	return nil
}

//	!!!! ВОЗМОЖНО ТУТ ОШИБКА
//
// GetColumnNames возвращает пользовательские названия столбцов
func (a *App) GetColumnNames() (map[string]string, error) {
	rows, err := a.db.Query("SELECT column_name, display_name FROM column_names")
	if err != nil {
		return nil, fmt.Errorf("ошибка при загрузке названий столбцов: %v", err)
	}
	defer rows.Close()

	columnNames := make(map[string]string)
	for rows.Next() {
		var columnName, displayName string
		if err := rows.Scan(&columnName, &displayName); err != nil {
			return nil, fmt.Errorf("ошибка при сканировании данных: %v", err)
		}
		columnNames[columnName] = displayName
	}

	fmt.Println("Загруженные названия столбцов:", columnNames) // Отладка
	return columnNames, nil
}

// Или тут ошибка
//
// UpdateColumnName обновляет пользовательское название столбца в базе данных
func (a *App) UpdateColumnName(columnName, newDisplayName string) error {
	query := `UPDATE column_names SET display_name = ? WHERE column_name = ?`
	_, err := a.db.Exec(query, newDisplayName, columnName)
	if err != nil {
		return fmt.Errorf("ошибка при обновлении названия столбца: %v", err)
	}
	return nil
}
