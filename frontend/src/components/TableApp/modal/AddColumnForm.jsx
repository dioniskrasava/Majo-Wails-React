import React, { useState } from 'react';

const AddColumnForm = ({ onAdd, onClose }) => {
    const [columnName, setColumnName] = useState('');
    const [columnType, setColumnType] = useState('TEXT');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!columnName.trim()) return;
        onAdd(columnName, columnType);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Добавить новый столбец</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя столбца:</label>
                        <input
                            type="text"
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                            required
                            placeholder="Например: email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Тип данных:</label>
                        <select
                            value={columnType}
                            onChange={(e) => setColumnType(e.target.value)}
                        >
                            <option value="TEXT">Текст</option>
                            <option value="INTEGER">Целое число</option>
                            <option value="REAL">Дробное число</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddColumnForm;