import { Formik, Form, Field, ErrorMessage } from "formik";
import style from "../styles/Profile.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import { HiArrowLeft, HiOutlineXCircle } from "react-icons/hi";
import Link from "next/link";
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import { watch } from "valtio/utils";
// import { subscribe } from "valtio";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUserInfo, useMain } from "vStore/main";
import Profile from "../public/img/Profile.svg";
import Image from "next/image";
import { getSession, useSession } from "next-auth/react";
import DeleteProfile from "./helpers/DeleteProfile";
const ProfileComponent =({ setModal, openModal }) =>{
  const router = useRouter();
  const { status, data } = useSession();
const {userInfo} = useMain();
  const showToastMessage = (confirm) => {
    confirm === "ok"
      ? toast.success("Datos guardados!", {
          position: toast.POSITION.TOP_CENTER,
        })
      : toast.error("Hubo un error al guardar los datos.", {
          position: toast.POSITION.TOP_CENTER,
        });
  };

  return ( status.includes("authenticated")&&
    <div className={style.form_container}>
      <ToastContainer />
      <h1 className={style.profile_title}>
        {!openModal && (
          <>
            <Link href="/dashboard" style={{ backgroundColor: "transparent" }}>
              <HiArrowLeft className={style.arrow_icon} />
            </Link>
            <div className={style.span_link}>
              <span>Perfil Veterinario</span>
            </div>
          </>
        )}

        {openModal && (
          <HiOutlineXCircle
            className={style.close_icon}
            onClick={() => setModal(true)}
          />
        )}
      </h1>

      <Formik
        initialValues={{
          name: userInfo ? userInfo.name : "",
          card: userInfo ? userInfo.card : "",
          address: userInfo ? userInfo.address : "",
          location: userInfo ? userInfo.location : "",
          neighborhood: userInfo ? userInfo.neighborhood : "",
          telephone: userInfo ? userInfo.telephone : "",
          email: userInfo ? userInfo.email : "",
          id: userInfo ? userInfo.id : "",
          surname: userInfo ? userInfo.surname : "",
          department: userInfo ? userInfo.department : "",
        }}
        // Add formik custom validation here

        validate={(values) => {
          const errors = {};
          // if (Object.values(values).length) {
          // Validating name
          !values.name
          ? (errors.name = "Nombre inválido")
          :/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]\s{3,25}$/i.test(values.name.trim())
          // Validating surname
          !values.surname
          ? (errors.surname = "Apellidos inválidos")
          : !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,25}\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,25}$/i.test(values.surname.trim())
          ? (errors.surname = "Completa  tus apellidos ")
            : errors;
          //Validating card
          !values.card
            ? (errors.card = "Completa tarjeta profesional")
            : !/^[0-9._%+-]{5,15}$/i.test(values.card.trim())
            ? (errors.card = "Tarjeta profesional incorrecta, debe tener min 5 digitos y máximo 15 digitos.")
            : errors;
          // Validating address
          !values.address
            ? (errors.address = "Completa la dirección")
            : !/^[A-Z0-9" "ñÑáéíóúÁÉÍÓÚ#._%+-]{5,40}$/i.test(values.address.trim())
            ? (errors.address = "Debes colocar un formato correcto de dirección")
            : errors;
          // Validating location
          !values.location
            ? (errors.location = "Completa la ciudad")
            : !/^[A-Z" "ñÑáéíóúÁÉÍÓÚ._%+-]{0,40}$/i.test(values.location.trim())
            ? (errors.location = "Ciudad invalida máximo 40 caracteres")
            : errors;
          // Validating neighborhood
          !values.neighborhood
            ? (errors.neighborhood = "Completa el Nombre del Barrio")
            : !/^[A-Z0-9" "ñÑáéíóúÁÉÍÓÚ._%+-]{4,40}$/i.test(values.neighborhood.trim())
            ? (errors.neighborhood = "Coloca un barrio con minimo 4 letras y máximo 40 letras")
            : errors;
          // Validating telephone
          !values.telephone
            ? (errors.telephone = "Completa tu numero celular")
            : !/^[A-Z0-9._%+-]{10,13}$/i.test(values.telephone.trim())
            ? (errors.telephone = "Celular invalido, minimo 10 digitos, maximo  13 digitos")
            : errors;
          // Validating email
          !values.email
            ? (errors.email = "Completa el correo")
            : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())
            ? (errors.email = "Correo invalido")
            : errors;
          // Validating IDCard
          !values.id
            ? (errors.id = "Completa la cédula")
            : !/^[0-9._%+-]{8,10}$/i.test(values.id.trim())
            ? (errors.id = "Cédula incorrecta debe colocar minimo 8 caracteres y un máximo de 10")
            : errors;
          // Validating location
          !values.department
            ? (errors.department = "Completa departamento")
            : !/^[A-Z" "ñÑáéíóúÁÉÍÓÚ._%+-]{0,40}$/i.test(values.department.trim())
            ? (errors.department = "Departamento inválido")
            : errors;

          return errors;
        }}
        // Sending profile form data

        onSubmit={(values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          setUserInfo(values);

          axios
            .post("/api/profile", values)
            .then((response) => {
              const {
                data: { status },
              } = response;
              console.log("RESPUESTA", response);
              showToastMessage(status);
            })
            .then(
              data.user && data.user.role === "Admin"
                ? router.replace("/admin-dashboard")
                : router.replace("/dashboard")
            )
            .catch((error) => {
              const {
                response: { status },
              } = error;
              showToastMessage(status);
            });
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className={style.form}>
            <h1 className={style.vet_title}>Datos Veterinario</h1>
            <Image
              src={Profile}
              className={style.profile_img}
              width={80}
              height={80}
              alt="google-profile-image-klean-vet"
            />
            <div className={style.block_container}>
              <div className={style.block_left}>
                <label className={style.input_label}>Nombres</label>
                <Field
                  className={style.input_field}
                  placeholder="Nombres"
                  type="text"
                  name="name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Apellidos</label>
                <Field
                  className={style.input_field}
                  placeholder="Apellidos"
                  type="text"
                  name="surname"
                />
                <ErrorMessage
                  name="surname"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Tarjeta Profesional</label>
                <Field
                  className={style.input_field}
                  placeholder="Tarjeta profesional"
                  type="text"
                  name="card"
                />
                <ErrorMessage
                  name="card"
                  component="div"
                  className={style.error}
                />

                <label className={style.input_label}>Cédula</label>
                <Field
                  className={style.input_field}
                  placeholder="Cédula"
                  type="text"
                  name="id"
                />
                <ErrorMessage
                  name="id"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Correo</label>
                <Field
                  className={style.input_field}
                  placeholder="Correo"
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={style.error}
                />
              </div>
              <div className={style.block_right}>
              <label className={style.input_label}>Celular</label>
                <Field
                  className={style.input_field}
                  placeholder="Celular"
                  type="text"
                  name="telephone"
                />
                <ErrorMessage
                  name="telephone"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Dirección</label>
                <Field
                  className={style.input_field}
                  placeholder="Dirección"
                  type="text"
                  name="address"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Barrio</label>
                <Field
                  className={style.input_field}
                  placeholder="Barrio"
                  type="text"
                  name="neighborhood"
                />
                <ErrorMessage
                  name="neighborhood"
                  component="div"
                  className={style.error}
                />
                <label className={style.input_label}>Ciudad</label>
                <Field
                  className={style.input_field}
                  placeholder="Ciudad"
                  type="text"
                  name="location"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className={style.error}
                />
              
              
                <label className={style.input_label}>Departamento</label>
                <Field
                  className={style.input_field}
                  placeholder="Departamento"
                  type="text"
                  name="department"
                />
                <ErrorMessage
                  name="department"
                  component="div"
                  className={style.error}
                />
              </div>
            </div>
            <div className={style.buttons_container}>
              <button
                className={style.submit}
                type="submit"
                disabled={isSubmitting}
              >
                Guardar
              </button>
              
                <button
                  className={style.cancel}
                  type="button"
                  onClick={() => {
                    data && data.user.role === "Admin"
                      ? router.replace("/admin-dashboard")
                      : router.replace("/dashboard");
                  }}
                >
                  {"Cancelar"}
                </button>
              
              
            </div>
            {/* {JSON.stringify(data.user.id)} */}
            <DeleteProfile urlApi={"/api/profile"} options={data.user.id||data.user._id}/>
          </Form>
        )}
      </Formik>
    </div>
  );
}

/* ProfileComponent.displayName = 'ProfileComponent'; */

export default ProfileComponent;
