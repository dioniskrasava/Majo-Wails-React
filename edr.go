// edr.go
// пакет функций для работы с EVERY DAY ROUTINE
package main

import (
	"fmt"
	"strings"
	"unicode"
)

// Универсальный метод для получения данных любой таблицы   26/03/25
func (a *App) GetTableData(tableName string) ([]map[string]interface{}, error) {
	// Сначала получаем все столбцы таблицы
	columns, err := a.getTableColumns(tableName)
	if err != nil {
		return nil, err
	}

	// Формируем запрос с ВСЕМИ столбцами
	query := fmt.Sprintf("SELECT %s FROM %s", strings.Join(columns, ", "), tableName)
	rows, err := a.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}
	for rows.Next() {
		// Динамическое сканирование всех столбцов
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))
		for i := range columns {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			return nil, err
		}

		entry := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			if b, ok := val.([]byte); ok {
				entry[col] = string(b) // Преобразуем []byte в string
			} else {
				entry[col] = val
			}
		}
		result = append(result, entry)
	}

	if result == nil {
		return []map[string]interface{}{}, nil // Возвращаем пустой массив
	}

	return result, nil
}

// Вспомогательная функция для получения столбцов таблицы  26/03/25
func (a *App) getTableColumns(tableName string) ([]string, error) {
	rows, err := a.db.Query(fmt.Sprintf("PRAGMA table_info(%s)", tableName))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []string
	for rows.Next() {
		var cid int
		var name string
		var notUsed interface{}
		if err := rows.Scan(&cid, &name, &notUsed, &notUsed, &notUsed, &notUsed); err != nil {
			return nil, err
		}
		columns = append(columns, name)
	}
	return columns, nil
}

// Добавление нового столбца  26/03/25
func (a *App) AddColumn(tableName, columnName, columnType string) error {
	if tableName == "" || columnName == "" || columnType == "" {
		return fmt.Errorf("все параметры должны быть заполнены")
	}

	// Проверяем валидность типа столбца
	validTypes := map[string]bool{"TEXT": true, "INTEGER": true, "REAL": true}
	if !validTypes[strings.ToUpper(columnType)] {
		return fmt.Errorf("недопустимый тип столбца: %s", columnType)
	}

	query := fmt.Sprintf(
		"ALTER TABLE %s ADD COLUMN %s %s",
		tableName,
		columnName,
		columnType,
	)

	_, err := a.db.Exec(query)
	if err != nil {
		return fmt.Errorf("ошибка добавления столбца: %v", err)
	}

	// Добавляем запись о названии столбца
	_, err = a.db.Exec(
		"INSERT OR IGNORE INTO column_names (column_name, display_name) VALUES (?, ?)",
		columnName,
		columnName,
	)

	return err
}

// GetTestData возвращает тестовые данные из базы данных
func (a *App) GetTestData() ([]map[string]interface{}, error) {
	rows, err := a.db.Query(`
        SELECT 
            id, 
            COALESCE(first_name, '') as first_name,
            COALESCE(last_name, '') as last_name,
            COALESCE(age, 0) as age
        FROM test_data
        ORDER BY id DESC
    `)
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
func (a *App) AddTestData(firstName, lastName string, age interface{}) error {
	var ageVal *int
	if age != nil {
		if v, ok := age.(int); ok {
			ageVal = &v
		}
	}

	query := `INSERT INTO test_data (first_name, last_name, age) VALUES (?, ?, ?)`
	_, err := a.db.Exec(query, firstName, lastName, ageVal)
	return err
}

// UpdateCellValue обновляет значение ячейки в таблице test_data
func (a *App) UpdateCellValue(id int, columnName string, value interface{}) error {
	// Проверяем существование столбца
	exists, err := a.columnExists("test_data", columnName)
	if err != nil {
		return fmt.Errorf("проверка столбца: %v", err)
	}
	if !exists {
		return fmt.Errorf("столбец %s не существует", columnName)
	}

	// Обрабатываем nil значения
	var val interface{}
	if value == nil {
		val = nil
	} else {
		val = value
	}

	query := fmt.Sprintf("UPDATE test_data SET %s = ? WHERE id = ?", columnName)
	_, err = a.db.Exec(query, val, id)
	if err != nil {
		return fmt.Errorf("ошибка обновления: %v", err)
	}
	return nil
}

func (a *App) columnExists(table, column string) (bool, error) {
	columns, err := a.getTableColumns(table)
	if err != nil {
		return false, err
	}
	for _, col := range columns {
		if col == column {
			return true, nil
		}
	}
	return false, nil
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
func (a *App) GetColumnNames(tableName string) (map[string]string, error) {
	// Сначала получаем реальные столбцы таблицы
	columns, err := a.getTableColumns(tableName)
	if err != nil {
		return nil, err
	}

	// Преобразуем []string в []interface{} для запроса
	params := make([]interface{}, len(columns))
	for i, col := range columns {
		params[i] = col
	}

	// Затем получаем пользовательские названия
	query := "SELECT column_name, display_name FROM column_names WHERE column_name IN (" +
		strings.Repeat("?, ", len(columns)-1) + "?)"
	rows, err := a.db.Query(query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columnNames := make(map[string]string)
	for rows.Next() {
		var columnName, displayName string
		if err := rows.Scan(&columnName, &displayName); err != nil {
			return nil, err
		}
		columnNames[columnName] = displayName
	}

	// Для столбцов без пользовательских названий используем имена из БД
	for _, col := range columns {
		if _, exists := columnNames[col]; !exists {
			columnNames[col] = strings.ReplaceAll(col, "_", " ")
		}
	}

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

// валидация 26/03/25

func isValidColumnType(t string) bool {
	validTypes := map[string]bool{
		"TEXT":    true,
		"INTEGER": true,
		"REAL":    true,
		"NUMERIC": true,
		"BLOB":    true,
	}
	return validTypes[strings.ToUpper(t)]
}

func sanitizeColumnName(name string) string {
	// Удаляем опасные символы
	return strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' {
			return r
		}
		return -1
	}, name)
}

// Добавляем новый метод для пустой строки
func (a *App) AddEmptyRow(tableName string) error {
	// Получаем все столбцы кроме ID
	columns, err := a.getTableColumns(tableName)
	if err != nil {
		return err
	}

	// Формируем SQL запрос
	var cols []string
	var placeholders []string
	for _, col := range columns {
		if col == "id" {
			continue
		}
		cols = append(cols, col)
		placeholders = append(placeholders, "NULL")
	}

	query := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s)",
		tableName,
		strings.Join(cols, ", "),
		strings.Join(placeholders, ", "),
	)

	_, err = a.db.Exec(query)
	return err
}
