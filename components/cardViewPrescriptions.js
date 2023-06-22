import axios from "axios";
import { useState } from "react";
import styles from "../styles/CardViewPrescription.module.css";
import { swaltConfirmPayment } from "./helpers/swaltHelpers";


const CardViewPrescription = ({
  owner,
  phone,
  patient,
  date,
  children,
  onDownload,
  diagnostic,
  veterinary,veterinarysurname,veterinarytelephone,veterinarylocation,
  email,
  presentation,
  units,
  role = null,
  idPrescription,
  prescriptionStateBD
}) => {
  const [prescriptionState, setPrescriptionState] = useState(prescriptionStateBD);
  const validarPago = () => {
    // .then(({value})=>console.log("llego:",value))
    swaltConfirmPayment()
      .then(({ value }) =>
        axios.post(
          "/api/validatePayment",
          value
            ? { prescriptionState: true, _id: idPrescription }
            : { prescriptionState: false, _id: idPrescription }
        )
      )
      .then((e) => setPrescriptionState(e.data.prescriptionState));
  };
  function enviarMensaje() {
    const numero = '+573245960052';
    const mensaje = `Buen día, soy el Dr. ${veterinary} ${veterinarysurname},médico veterinario de la ciudad de ${veterinarylocation} y estoy interesado en hacer el pago por el siguiente pedido:
    
    - Presentacion: ${presentation}.
    - Cantidad: ${units}. 
    - Diagnostico:${ diagnostic}.
    
Por favor, infórmeme sobre el proceso de pago y la entrega del medicamento. Quedo a la espera de su respuesta. Muchas gracias.
    `; 

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url);
  }

  return (
    <div className={styles.card}>
      <div className={styles.letter}>
      {role ? <h3 className={styles.title}>Veterinario: {veterinary} {veterinarysurname}</h3> : null}
        <h3 className={styles.title}>Dueño: {owner}</h3>
        <p className={styles.owner}>Paciente: {patient}</p>
        <p className={styles.phone}>Telefono: {phone}</p>
        <p className={styles.date}>Fecha de creación: {date}</p>
        {role ? <p className={styles.payment}>Estado: {prescriptionState? 'Pagada':'No pagada'}</p> : null}
        
      </div>
      <div className={styles.buttonsContainer}>
        <button className={styles.downloadBtn} onClick={onDownload}>
          Descargar {children}
        </button>
        <button
          className={styles.payBtn}
          onClick={role ? validarPago : enviarMensaje}
        >
          {role ? "Validar pago" : "Pagar"}
        </button>
      </div>
    </div>
  );
};

export default CardViewPrescription;


/* Buen día, soy el Dr. Nombre y Apellido, médico veterinario de la ciudad de Medellín y estoy interesado en hacer el pago por el siguiente pedido:

Presentación: Frasco (1%) 15 mL 150 mg.
Cantidad: 1.
Diagnóstico: ANSIEDAD.

Por favor, infórmeme sobre el proceso de pago y la entrega del medicamento. Quedo a la espera de su respuesta. Muchas gracias. */