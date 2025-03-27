package edr

import (
	"database/sql"
	"fmt"
	"strings"
	"unicode"
)

// Определения ошибок
var (
	ErrInvalidTableName   = fmt.Errorf("некорректное имя таблицы")
	ErrInvalidColumnName  = fmt.Errorf("некорректное имя столбца")
	ErrInvalidColumnType  = fmt.Errorf("некорректный тип столбца")
	ErrColumnAlreadyExist = fmt.Errorf("столбец уже существует")
	ErrEmptyTableName     = fmt.Errorf("имя таблицы не может быть пустым")
)

// TestData представляет запись в таблице test_data
type TestData struct {
	ID        int    `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Age       int    `json:"age"`
}

// ColumnInfo содержит метаданные о столбце
type ColumnInfo struct {
	Name     string
	Type     string
	Nullable bool
}

/******************************
* Основные методы работы с БД *
******************************/

// AddTestData добавляет новую запись в таблицу test_data
func AddTestData(db *sql.DB, firstName, lastName string, age interface{}) error {
	ageVal, err := parseAge(age)
	if err != nil {
		return err
	}

	const query = `INSERT INTO test_data (first_name, last_name, age) VALUES (?, ?, ?)`
	_, err = db.Exec(query, firstName, lastName, ageVal)
	return err
}

// GetTestData получает данные из таблицы test_data
func GetTestData(db *sql.DB) ([]map[string]interface{}, error) {
	const query = `
		SELECT id, COALESCE(first_name, '') as first_name,
		COALESCE(last_name, '') as last_name,
		COALESCE(age, 0) as age
		FROM test_data ORDER BY id DESC`

	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса: %w", err)
	}
	defer rows.Close()

	columns := []string{"id", "first_name", "last_name", "age"}
	return scanRowsToMap(rows, columns)
}

// GetTableData получает данные из произвольной таблицы
func GetTableData(db *sql.DB, tableName string) ([]map[string]interface{}, error) {
	if err := validateTableName(tableName); err != nil {
		return nil, err
	}

	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return nil, fmt.Errorf("ошибка получения столбцов: %w", err)
	}

	query := fmt.Sprintf("SELECT %s FROM %s", strings.Join(columns, ", "), tableName)
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса: %w", err)
	}
	defer rows.Close()

	return scanRowsToMap(rows, columns)
}

// AddColumn добавляет столбец в таблицу
func AddColumn(db *sql.DB, tableName, columnName, columnType string) error {
	if err := validateTableName(tableName); err != nil {
		return err
	}

	columnName = sanitizeColumnName(columnName)
	if columnName == "" {
		return ErrInvalidColumnName
	}

	if !isValidColumnType(columnType) {
		return ErrInvalidColumnType
	}

	exists, err := ColumnExists(db, tableName, columnName)
	if err != nil {
		return fmt.Errorf("ошибка проверки столбца: %w", err)
	}
	if exists {
		return ErrColumnAlreadyExist
	}

	// Добавляем столбец в таблицу
	query := fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s", tableName, columnName, columnType)
	_, err = db.Exec(query)
	if err != nil {
		return fmt.Errorf("ошибка добавления столбца: %w", err)
	}

	// Добавляем запись о столбце в таблицу column_names
	_, err = db.Exec(
		"INSERT OR IGNORE INTO column_names (column_name, display_name) VALUES (?, ?)",
		columnName,
		columnName, // Используем columnName как начальное display_name
	)
	if err != nil {
		return fmt.Errorf("ошибка добавления имени столбца: %w", err)
	}

	return nil
}

// DeleteRow удаляет строку из таблицы
func DeleteRow(db *sql.DB, tableName string, id int) error {
	if err := validateTableName(tableName); err != nil {
		return err
	}

	// Проверяем существование строки
	exists, err := rowExists(db, tableName, id)
	if err != nil {
		return fmt.Errorf("ошибка проверки строки: %w", err)
	}
	if !exists {
		return fmt.Errorf("строка с id %d не существует", id)
	}

	query := fmt.Sprintf("DELETE FROM %s WHERE id = ?", tableName)
	_, err = db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("ошибка удаления строки: %w", err)
	}
	return nil
}

// rowExists проверяет существование строки по ID
func rowExists(db *sql.DB, tableName string, id int) (bool, error) {
	var exists bool
	query := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM %s WHERE id = ?)", tableName)
	err := db.QueryRow(query, id).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("ошибка проверки строки: %w", err)
	}
	return exists, nil
}

// ColumnExists проверяет существование столбца
func ColumnExists(db *sql.DB, tableName, columnName string) (bool, error) {
	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return false, err
	}

	for _, col := range columns {
		if col == columnName {
			return true, nil
		}
	}
	return false, nil
}

// GetColumnNames возвращает отображаемые имена столбцов
func GetColumnNames(db *sql.DB, tableName string) (map[string]string, error) {
	columns, err := getTableColumns(db, tableName)
	if err != nil {
		return nil, fmt.Errorf("не удалось получить столбцы таблицы: %w", err)
	}

	if len(columns) == 0 {
		return make(map[string]string), nil
	}

	query := "SELECT column_name, display_name FROM column_names WHERE column_name IN (" +
		strings.Repeat("?, ", len(columns)-1) + "?)"

	// Преобразуем []string в []interface{}
	params := make([]interface{}, len(columns))
	for i, col := range columns {
		params[i] = col
	}

	rows, err := db.Query(query, params...)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса пользовательских имен: %w", err)
	}
	defer rows.Close()

	columnNames := make(map[string]string)
	for rows.Next() {
		var (
			columnName  string
			displayName string
		)
		if err := rows.Scan(&columnName, &displayName); err != nil {
			return nil, fmt.Errorf("ошибка сканирования имен столбцов: %w", err)
		}
		columnNames[columnName] = displayName
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("ошибка при обработке результатов имен: %w", err)
	}

	// Заполняем недостающие значения
	for _, col := range columns {
		if _, exists := columnNames[col]; !exists {
			columnNames[col] = strings.ReplaceAll(col, "_", " ")
		}
	}

	return columnNames, nil
}

// UpdateColumnName обновляет отображаемое имя столбца
func UpdateColumnName(db *sql.DB, columnName, displayName string) error {
	// Проверяем существование столбца в таблице column_names
	exists, err := columnNameExists(db, columnName)
	if err != nil {
		return fmt.Errorf("ошибка проверки столбца: %w", err)
	}

	if !exists {
		// Если столбца нет в column_names, добавляем новую запись
		_, err = db.Exec(
			`INSERT INTO column_names (column_name, display_name) VALUES (?, ?)`,
			columnName,
			displayName,
		)
	} else {
		// Если столбец существует, обновляем его
		_, err = db.Exec(
			`UPDATE column_names SET display_name = ? WHERE column_name = ?`,
			displayName,
			columnName,
		)
	}

	if err != nil {
		return fmt.Errorf("ошибка обновления названия столбца: %w", err)
	}
	return nil
}

// columnNameExists проверяет, существует ли столбец в таблице column_names
func columnNameExists(db *sql.DB, columnName string) (bool, error) {
	var exists bool
	err := db.QueryRow(
		`SELECT EXISTS(SELECT 1 FROM column_names WHERE column_name = ?)`,
		columnName,
	).Scan(&exists)

	if err != nil {
		return false, fmt.Errorf("ошибка проверки существования столбца: %w", err)
	}
	return exists, nil
}

// AddEmptyRow добавляет пустую строку в таблицу
func AddEmptyRow(db *sql.DB, tableName string) error {
	if err := validateTableName(tableName); err != nil {
		return err
	}

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

/************************************
* Вспомогательные функции *
************************************/

// getTableColumns возвращает список столбцов таблицы
func getTableColumns(db *sql.DB, tableName string) ([]string, error) {
	rows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", tableName))
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса информации о таблице: %w", err)
	}
	defer rows.Close()

	var columns []string
	for rows.Next() {
		var (
			cid     int
			name    string
			typ     string
			notnull int
			dflt    interface{}
			pk      int
		)
		// Сканируем ВСЕ поля, даже если не используем их
		if err := rows.Scan(&cid, &name, &typ, &notnull, &dflt, &pk); err != nil {
			return nil, fmt.Errorf("ошибка сканирования информации о столбце: %w", err)
		}
		columns = append(columns, name)
	}

	// Проверяем ошибки после итерации
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("ошибка при обработке результатов: %w", err)
	}

	return columns, nil
}

// scanRowsToMap преобразует строки результата в мапы
func scanRowsToMap(rows *sql.Rows, columns []string) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
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
			if b, ok := values[i].([]byte); ok {
				entry[col] = string(b)
			} else {
				entry[col] = values[i]
			}
		}
		results = append(results, entry)
	}
	return results, nil
}

// parseAge преобразует значение возраста
func parseAge(age interface{}) (*int, error) {
	if age == nil {
		return nil, nil
	}

	if v, ok := age.(int); ok {
		return &v, nil
	}
	return nil, fmt.Errorf("возраст должен быть числом")
}

// validateTableName проверяет валидность имени таблицы
func validateTableName(name string) error {
	if name == "" {
		return ErrEmptyTableName
	}
	if strings.ContainsAny(name, " ;'\"") {
		return ErrInvalidTableName
	}
	return nil
}

// sanitizeColumnName очищает имя столбца
func sanitizeColumnName(name string) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' {
			return r
		}
		return -1
	}, name)
}

// isValidColumnType проверяет тип столбца
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
