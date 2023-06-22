import React, { useState } from 'react';

function PetForm() {
  const [formData, setFormData] = useState({
    owner: '',
    petName: '',
    city: ''
  });

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(formData);
    // send formData to server or do something else with it
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Owner:
        <input
          type="text"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Pet Name:
        <input
          type="text"
          name="petName"
          value={formData.petName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PetForm;