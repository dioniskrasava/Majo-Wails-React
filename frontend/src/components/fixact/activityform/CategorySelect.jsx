// src/components/fixact/activityform/CategorySelect.jsx
import React from 'react';

import { FormattedMessage } from 'react-intl'; // multilanguage

/*Импорты иконок*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

const CategorySelect = ({
  categories,
  activityType,
  handleActivityTypeChange,
  handleAddTypeActivity,
}) => {
  return (
    <div className="form-row">
      <label htmlFor="activity-type" className="labelFormFixAct">
        <FormattedMessage id="fixact.typeAct" defaultMessage="Тип" />
      </label>
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
      <button type="button" id="add-activity" onClick={handleAddTypeActivity} className="button-fixact-support">
        <FontAwesomeIcon icon={faList} size='lg' />
      </button>
    </div>
  );
};

export default CategorySelect;