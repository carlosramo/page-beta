import React, { useState } from 'react';
import { proxy, useSnapshot } from 'valtio';

function Modal(props) {
    const snap = useSnapshot(state)
    // console.log(snap)
  const [isOpen, setIsOpen] = useState(props);
  const [formData, setFormData] = useState({
    md: '',
    patientName: '',
    weight: '',
    age: '',
    race: '',
    sex: '',
    identification: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    municipality: '',
    department: '',
    neighborhood: ''
  });

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(formData);
    // You could also send the data to a server here
  };

  return (
    <div className="modal-container">
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <label>
              M.D
              <input
                type="text"
                name="md"
                value={formData.md}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nombre paciente
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Peso
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Edad
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Raza
              <input
                type="text"
                name="race"
                value={formData.race}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Sexo
              <input
                type="text"
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Identificación
              <input
                type="text"
                name="identification"
                value={formData.identification}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Propietario
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email
              <input
                type="text" name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Teléfonos
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Dirección
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Municipio
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Departamento
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Barrio
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Modal;