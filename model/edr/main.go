package edr

import (
	"database/sql"
	"fmt"
	"strings"
	"unicode"
)

// Ошибки базы данных
var (
	ErrInvalidTableName   = fmt.Errorf("недопустимое имя таблицы")
	ErrInvalidColumnName  = fmt.Errorf("недопустимое имя столбца")
	ErrInvalidColumnType  = fmt.Errorf("недопустимый тип столбца")
	ErrColumnAlreadyExist = fmt.Errorf("столбец уже существует")
)

// AddTestData добавляет строку в таблицу test_data (EDR)
func AddTestData(db *sql.DB, firstName, lastName string, age interface{}) error {
	var ageVal *int
	if age != nil {
		if v, ok := age.(int); ok {
			ageVal = &v
		}
	}

	query := `INSERT INTO test_data (first_name, last_name, age) VALUES (?, ?, ?)`
	_, err := db.Exec(query, firstName, lastName, ageVal)
	return err
}

// GetTestData возвращает тестовые данные из базы данных
func GetTestData(db *sql.DB) ([]map[string]interface{}, error) {
	rows, err := db.Query(`
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

// GetTableData возвращает все данные из указанной таблицы
func GetTableData(db *sql.DB, tableName string) ([]map[string]interface{}, error) {
	if !isValidTableName(tableName) {
		return nil, ErrInvalidTableName
	}

	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return nil, fmt.Errorf("получение столбцов: %v", err)
	}

	query := fmt.Sprintf("SELECT %s FROM %s", strings.Join(columns, ", "), tableName)
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("выполнение запроса: %v", err)
	}
	defer rows.Close()

	return scanRowsToMap(rows, columns)
}

// AddColumn добавляет новый столбец в таблицу
func AddColumn(db *sql.DB, tableName, columnName, columnType string) error {
	if !isValidTableName(tableName) {
		return ErrInvalidTableName
	}

	columnName = sanitizeColumnName(columnName)
	if columnName == "" {
		return ErrInvalidColumnName
	}

	if !isValidColumnType(columnType) {
		return ErrInvalidColumnType
	}

	// Проверяем, существует ли столбец
	exists, err := columnExists(db, tableName, columnName)
	if err != nil {
		return fmt.Errorf("проверка столбца: %v", err)
	}
	if exists {
		return ErrColumnAlreadyExist
	}

	query := fmt.Sprintf(
		"ALTER TABLE %s ADD COLUMN %s %s",
		tableName,
		columnName,
		columnType,
	)

	_, err = db.Exec(query)
	if err != nil {
		return fmt.Errorf("добавление столбца: %v", err)
	}

	return nil
}

// Вспомогательные функции
func getTableColumns(db *sql.DB, tableName string) ([]string, error) {
	rows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", tableName))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []string
	for rows.Next() {
		var cid int
		var name string
		var notUsed interface{} // Пропускаем остальные поля PRAGMA
		if err := rows.Scan(&cid, &name, &notUsed, &notUsed, &notUsed, &notUsed); err != nil {
			return nil, err
		}
		columns = append(columns, name)
	}
	return columns, nil
}

func columnExists(db *sql.DB, table, column string) (bool, error) {
	columns, err := getTableColumns(db, table)
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

func scanRowsToMap(rows *sql.Rows, columns []string) ([]map[string]interface{}, error) {
	var result []map[string]interface{}
	for rows.Next() {
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
				entry[col] = string(b)
			} else {
				entry[col] = val
			}
		}
		result = append(result, entry)
	}
	return result, nil
}

func isValidTableName(name string) bool {
	return name != "" && !strings.ContainsAny(name, " ;'\"")
}

func sanitizeColumnName(name string) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' {
			return r
		}
		return -1
	}, name)
}

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

// DeleteRow удаляет строку по ID из указанной таблицы
func DeleteRow(db *sql.DB, tableName string, id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id = ?", tableName)
	_, err := db.Exec(query, id)
	return err
}

// ColumnExists проверяет существование столбца
func ColumnExists(db *sql.DB, table, column string) (bool, error) {
	columns, err := getTableColumns(db, table)
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

// GetColumnNames возвращает маппинг "столбец -> отображаемое имя"
func GetColumnNames(db *sql.DB, tableName string) (map[string]string, error) {
	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return nil, err
	}

	query := `
        SELECT column_name, display_name 
        FROM column_names 
        WHERE column_name IN (` + strings.Repeat("?, ", len(columns)-1) + "?)"

	params := make([]interface{}, len(columns))
	for i, col := range columns {
		params[i] = col
	}

	rows, err := db.Query(query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]string)
	for rows.Next() {
		var colName, displayName string
		if err := rows.Scan(&colName, &displayName); err != nil {
			return nil, err
		}
		result[colName] = displayName
	}

	// Заполняем недостающие значения
	for _, col := range columns {
		if _, exists := result[col]; !exists {
			result[col] = strings.ReplaceAll(col, "_", " ")
		}
	}

	return result, nil
}

// UpdateColumnName обновляет отображаемое имя столбца
func UpdateColumnName(db *sql.DB, columnName, displayName string) error {
	_, err := db.Exec(
		`INSERT OR REPLACE INTO column_names (column_name, display_name) 
         VALUES (?, ?)`,
		columnName,
		displayName,
	)
	return err
}

// AddEmptyRow добавляет пустую строку
func AddEmptyRow(db *sql.DB, tableName string) error {
	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return err
	}

	var filteredColumns []string
	for _, col := range columns {
		if col != "id" {
			filteredColumns = append(filteredColumns, col)
		}
	}

	query := fmt.Sprintf(
		"INSERT INTO %s (%s) VALUES (%s)",
		tableName,
		strings.Join(filteredColumns, ", "),
		strings.Repeat("NULL, ", len(filteredColumns)-1)+"NULL",
	)

	_, err = db.Exec(query)
	return err
}
