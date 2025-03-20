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
  grayBlue: {
    background: 'linear-gradient(135deg, rgb(105, 111, 148), rgb(59, 72, 146))',
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
      delayShow={2000}
      delayHide={300}
      place="top"
      style={tooltipStyle}
    />
  );
};

export default TooltipCustom;


