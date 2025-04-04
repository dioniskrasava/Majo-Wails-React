import React, { useState } from 'react';
import './NotesApp.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    category: '',
    text: '',
  });
  const [activeCategory, setActiveCategory] = useState('Все');

  // Добавление новой заметки
  const addNote = () => {
    if (newNote.text.trim() === '') return;
    
    const now = new Date();
    const formattedDateTime = 
      `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const noteToAdd = {
      ...newNote,
      dateTime: formattedDateTime,
      completed: false,
      id: Date.now()
    };
    
    setNotes([...notes, noteToAdd]);
    setNewNote({ category: '', text: '' });
  };

  // Переключение статуса выполнения
  const toggleComplete = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  // Удаление заметки
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Фильтрация заметок по категории
  const filteredNotes = activeCategory === 'Все' 
    ? notes 
    : notes.filter(note => note.category === activeCategory);

  // Категории для фильтрации
  const categories = ['Все', 'Работа', 'Личное', 'Учеба', 'Другое'];

  return (
    <div className="notes-app">
      <h1>Мои заметки</h1>
      
      {/* Форма добавления заметки */}
      <div className="add-note-form">
        <select
          value={newNote.category}
          onChange={(e) => setNewNote({...newNote, category: e.target.value})}
          className="category-select"
        >
          <option value="">Категория</option>
          {categories.filter(cat => cat !== 'Все').map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={newNote.text}
          onChange={(e) => setNewNote({...newNote, text: e.target.value})}
          placeholder="Введите заметку..."
          className="note-input"
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
        />
        
        <button onClick={addNote} className="add-btn">
          Добавить
        </button>
      </div>
      
      {/* Фильтр по категориям */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Список заметок */}
      <div className="notes-list">
        {filteredNotes.map(note => (
          <div key={note.id} className={`note-item ${note.completed ? 'completed' : ''}`}>
            <div className="note-content">
              <span 
                className="complete-checkbox"
                onClick={() => toggleComplete(note.id)}
              >
                {note.completed ? '✓' : ''}
              </span>
              
              <div className="note-text">
                <span className="note-category">{note.category}</span>
                {note.text}
                <span className="note-date">{note.dateTime}</span>
              </div>
            </div>
            
            <button 
              className="delete-btn"
              onClick={() => deleteNote(note.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;