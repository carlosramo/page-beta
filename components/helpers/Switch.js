import React, { useState } from 'react';
import styles from './_switch.module.scss';

const Switch = ({ onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
    if (onChange) onChange(!checked);
  };

  return (
    <label className={`${styles.switch} ${checked ? styles.on : styles.off}`} onClick={handleToggle}>
      <span className={styles.slider}></span>

    </label>
  );
};

export default Switch;
