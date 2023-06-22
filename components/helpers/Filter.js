import React, { useEffect, useState } from "react";
import styles from "./_filter.module.scss";

const FilterComponent = ({ filterText, onFilterChange }) =>{
  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
      <input
      className={styles.input}
      type="text"
      placeholder="Buscar..."
      value={filterText}
      onChange={handleFilterChange}
    />
  );
};

export default FilterComponent;
