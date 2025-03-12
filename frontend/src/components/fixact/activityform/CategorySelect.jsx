// Компонент для выбора категории и добавления новой.

import React from "react";

const CategorySelect = ({
  categories,
  activityType,
  handleActivityTypeChange,
  handleAddTypeActivity,
}) => {
  return (
    <div className="form-row">
      <label htmlFor="activity-type" className="labelFormFixAct">Тип :</label>
      <select
        id="activity-type"
        className="select-field"
        value={activityType}
        onChange={handleActivityTypeChange}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="button" id="add-activity" onClick={handleAddTypeActivity}>
        ᐊ
      </button>
    </div>
  );
};

export default CategorySelect;