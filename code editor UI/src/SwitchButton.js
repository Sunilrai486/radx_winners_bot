import React, { useState, useEffect } from 'react';
import './SwitchButton.css';

function SwitchButton({ onToggle, isOn }) {
  const [internalIsOn, setInternalIsOn] = useState(isOn);

  useEffect(() => {
    setInternalIsOn(isOn);
  }, [isOn]);

  const toggleSwitch = () => {
    setInternalIsOn(!internalIsOn);
    onToggle(!internalIsOn);
  };

  return (
    <div className={`switch ${internalIsOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
      <div className="slider"></div>
    </div>
  );
}

export default SwitchButton;
