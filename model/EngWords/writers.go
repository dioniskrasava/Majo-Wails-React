package engwords

import (
	"fmt"
)

// IncrementGuessing увеличивает значение guessing на 1 для слова с указанным ID
func IncrementGuessing(id int) error {
	db := openDB()
	defer db.Close()
	updateSQL := `UPDATE words SET guessing = guessing + 1 WHERE id = ?`

	_, err := db.Exec(updateSQL, id)
	if err != nil {
		return fmt.Errorf("ошибка при увеличении guessing: %v", err)
	}

	return nil
}
