import React, { useState } from 'react';
import './SwitchButton.css'

function SwitchButton({onToggle}) {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    onToggle(!isOn)
  };

  return (
    <div className={`switch ${isOn ? 'on' : 'off'}`} onClick={toggleSwitch}>
      <div className="slider"></div>
    </div>
  );
}

export default SwitchButton;
