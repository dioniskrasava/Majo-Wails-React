// src/components/fixact/activityform/TimeInput.jsx
import React from 'react';

const TimeInput = ({
  label,
  id,
  value,
  onChange,
  readOnly,
  onSetCurrentTime,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={id} className="labelFormFixAct">{label}</label>
      <input
        type="text"
        id={id}
        placeholder="hh:mm:ss"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <button type="button" id={`set-${id}`} onClick={onSetCurrentTime} className="button-fixact-support">
        ᐊ
      </button>
    </div>
  );
};

export default TimeInput;