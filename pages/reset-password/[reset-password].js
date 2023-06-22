import { useState } from "react";
import { getToken } from "next-auth/jwt";
import Logo from "../../public/img/logokleanvetv2.svg";
import style from "../../styles/ForgotPassword.module.css";
import Image from "next/image";
import { swaltResetPasswordSucces } from "../../components/helpers/swaltHelpers";
import { swaltResetPasswordError } from "../../components/helpers/swaltHelpers";

export default function ResetPassword({ email, token }) {
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  console.log({ email, token });

  const inputsAreEqual = password !== "" && password === secondPassword;
  const handleSubmit = (e) => {
    if (password === secondPassword) {
      console.log("tu nueva  contraseña es :", password);
    } else {
      console.log("verifica que las dos contraseñas sean iguales");
    }
    console.log("se esta ejecutando");
    updatePassword();
  };

  async function updatePassword() {
    try {
      const response = await fetch("/api/auth/updatePassword", {
        method: "PUT",
        //   body: JSON.stringify({ password }),
        body: JSON.stringify({ password, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // console.log({ data });
      // if (!response.ok) {
      //   throw new Error(data.message || "Something went wrong!");
      // }
      swaltResetPasswordSucces();
      return data;
    } catch (error) {
      swaltResetPasswordError();
    }
  }

  return (
    <div className={style.row}>
      <h1>Restablecer la contraseña</h1>
      <h6 className={style.informationText}>
        Escribe dos veces tu nueva contraseña.
      </h6>
      <div className={style.formGroupV}>
        <label>Escribe nueva contraseña.</label>
        <input
          style={{ backgroundColor: "white", color: "black" }}
          type="password"
          placeholder=" Nueva contraseña"
          pattern="^\S*$"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label></label>
        <input
          style={{ backgroundColor: "white", color: "black" }}
          type="password"
          placeholder=" Vuelve a escribir la contraseña"
          pattern="^\S*$"
          value={secondPassword}
          onChange={(e) => setSecondPassword(e.target.value)}
        />

        <button
          style={{ backgroundColor: "#ff8000", color: "white" }}
          onClick={handleSubmit}
          disabled={!inputsAreEqual}
        >
          Cambiar contraseña
        </button>
      </div>
      <div className={style.footerV}>
        <h5>
          {" "}
          <a href="#">Ir a la página principal.</a>
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
}

export async function getServerSideProps({ context, req }) {
  // context value contains the query params
  // const param = context.paramName;
  // console.log(req.query);
  // console.log(context);
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const { email } = token;

  return { props: { context: "lo que sea", email, token } };
}
