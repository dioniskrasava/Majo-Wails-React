import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { TooltipCustom } from '../../auxiliaryComponents/TooltipCustom';
import Select from 'react-select';
import './styles/select.css'

const CategorySelect = ({
  categories = [], // Значение по умолчанию
  activityType,
  handleActivityTypeChange,
  handleAddTypeActivity,
}) => {
  const intl = useIntl();
  const addTypeActivityTooltip = intl.formatMessage({
    id: 'fixact.addTypeActivity-tooltip',
    defaultMessage: 'Добавить/редактировать категории',
  });
  const placeholderSelectText = intl.formatMessage({id:"fixact.typeSelectPlaceHolder", defaultMessage:"Выберите категорию"})

  // Преобразуем categories в формат для react-select
  const options = categories.map((category) => ({
    value: category,
    label: category,
  }));

  // Обработчик для react-select
  const handleSelectChange = (selectedOption) => {
    handleActivityTypeChange({ target: { value: selectedOption.value } });
  };

  // Находим текущее значение для react-select
  const selectedOption = options.find((opt) => opt.value === activityType);

  return (
    <div className="form-row">
      <label htmlFor="activity-type" className="labelFormFixAct">
        <FormattedMessage id="fixact.typeAct" defaultMessage="Тип" />
      </label>
      <Select
        id="activity-type"
        className="react-select-container"
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholderSelectText}
        classNamePrefix="react-select"
      />
      <button
        type="button"
        id="add-activity"
        onClick={handleAddTypeActivity}
        className="button-fixact-support"
        data-tooltip-id="add-type-acivity-tooltip"
        data-tooltip-content={addTypeActivityTooltip}
      >
        <FontAwesomeIcon icon={faList} size="lg" />
      </button>
      <TooltipCustom id="add-type-acivity-tooltip" styleColor="grayBlue" />
    </div>
  );
};

export default CategorySelect;