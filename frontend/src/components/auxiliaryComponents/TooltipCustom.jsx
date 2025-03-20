import { Tooltip } from 'react-tooltip'; // всплывающие подсказки

// Стили для разных цветов
const tooltipStyles = {
  orange: {
    background: 'linear-gradient(135deg, rgb(231, 154, 102), rgb(155, 70, 0))',
    color: '#fff',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  green: {
    background: 'linear-gradient(135deg, rgb(102, 231, 102), rgb(26, 155, 0))',
    color: '#fff',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  blue: {
    background: 'linear-gradient(135deg, rgb(102, 121, 231), rgb(0, 23, 155))',
    color: '#fff',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

// Функциональный компонент с двумя пропсами
const TooltipCustom = ({ id, styleColor }) => {
  // Получаем стиль для выбранного цвета
  const tooltipStyle = tooltipStyles[styleColor];

  // Если стиль не найден, возвращаем null
  if (!tooltipStyle) {
    return null;
  }

  return (
    <Tooltip
      id={id}
      delayShow={1500}
      delayHide={300}
      place="top"
      style={tooltipStyle}
    />
  );
};

export default TooltipCustom;


