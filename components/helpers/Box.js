import styles from "./_box.module.scss";
 const Box = ({ text, numItem, Icon, label, klass }) => {
  return (
    <div className="overview">
      <div className="title">
        <i className="uil uil-tachometer-fast-alt"></i>
        <span className="text">Resumen </span>
      </div>

      <div className={klass || styles.box}>
        <div className={klass || styles.box_items}><span className={klass || styles.box_text}>{text}</span></div>
        <span className={klass || styles.box_num}>{numItem}</span>
      </div>
    </div>
  );
};

export default Box;
