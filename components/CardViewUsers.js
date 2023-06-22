import styles from '../styles/CardViewPrescription.module.css';

const  CardViewUsers = ({owner, phone, patient, date, children }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Dueño: {owner}</h3>
      <p className={styles.owner}>Paciente: {patient}</p>
      <p className={styles.phone}>Telefono: {phone}</p>
      <p className={styles.date}>Fecha de creación: {date}</p>
      Descargar {children}
    </div>
  );
}

export default  CardViewUsers