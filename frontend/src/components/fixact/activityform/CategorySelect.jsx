// src/components/fixact/activityform/CategorySelect.jsx
import React from 'react';

import { FormattedMessage } from 'react-intl'; // multilanguage
import { useIntl } from 'react-intl';

/*Импорты иконок*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

// кастомная всплывающая подсказка для кнопок
import { TooltipCustom} from '../../auxiliaryComponents/TooltipCustom';

const CategorySelect = ({
  categories,
  activityType,
  handleActivityTypeChange,
  handleAddTypeActivity,
}) => {


const intl = useIntl(); // хук для вытаскивания мультЯз значения и создания переменной
// мультиязычные переменные
const addTypeActivityTooltip = intl.formatMessage({ id: 'fixact.addTypeActivity-tooltip', defaultMessage: 'Добавить/редактировать категории'})


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
      <button type="button" id="add-activity" onClick={handleAddTypeActivity} 
              className="button-fixact-support"
              data-tooltip-id="add-type-acivity-tooltip"
              data-tooltip-content={addTypeActivityTooltip}>
        <FontAwesomeIcon icon={faList} size='lg' />
      </button>
      <TooltipCustom id="add-type-acivity-tooltip" styleColor="grayBlue"/>
    </div>
  );
};

export default CategorySelect;