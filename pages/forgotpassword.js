import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Logo from "../public/img/logokleanvetv2.svg";
import style from "../styles/ForgotPassword.module.css";
import Image from "next/image";
import { swaltConfirmPasswordTrue } from "../components/helpers/swaltHelpers";
import { swaltConfirmPasswordFalse } from "../components/helpers/swaltHelpers";
import BarLoader from "react-spinners/BarLoader";
// Read the HTML template from file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const { status, data: session } = useSession();
  const router = useRouter();
  const [value, setValue] = useState("");
 const [loading, setLoading] = useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    const newValue = event.target.value.toLowerCase().replace(/\s/g, "");
    setValue(newValue);
 
  };

  const handleSubmit = async () => {
    setLoading(true)
    const response = await fetch("/api/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      
    });

    const data = await response.json();
console.log(data)
    if (data.message=='Password reset email sent') {
      setLoading(false)

      swaltConfirmPasswordTrue();
    } else {
      setLoading(false)
      setMessage(data.message);
      swaltConfirmPasswordFalse();
    }
    
    console.log(data.message)
  };

  /* if (status === 'authenticated') {
    router.push('/');
  } */

  return (
    <div className={style.row}>
      <h1>Olvide mi contraseña</h1>
      <h6 className={style.informationText}>
        Ingresa tu email registrado para recuperar tu contraseña.
      </h6>
      <div className={style.formGroupV}>
        <label for="fname">
          Escribe tu correo, haz click en recuperar contraseña y sigue las
          instrucciones en tu correo
        </label>
        <input
          style={{ backgroundColor: "white", color: "black" }}
          type="text"
          id="fname"
          name="firstname"
          placeholder=" Escribe tu correo"
          onChange={(e) => handleEmailChange(e)}
          pattern="^\S*$"
           value={value}
        />
          {loading === true ? (<BarLoader color="#36d7b7" />) : (null)}
        <button
          disabled={loading}
          style={{ backgroundColor: "#ff8000", color: "white" }}
          onClick={handleSubmit }
        >
          Recuperar Contraseña
        </button>
      </div>
      <div className={style.footerV}>
        <h5>
          {" "}
          <a href="https://app.klean-vet.com">Ir a la página principal.</a>
        </h5>
        <p className={style.informationText}></p>
        <Image
          src={Logo}
          alt="Picture of the author"
          /* width={500}
                height={500} */
        />
      </div>

      
    </div>
  );
};

export default ForgotPassword;
