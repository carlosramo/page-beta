import styles from "styles/Formula.module.scss";
import axios from "axios";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { subscribe, watch } from "valtio";
import {
  useMain,
  setPersonalizePrescription,
  setPrescription2,
} from "../vStore/main";
import { nanoid } from "nanoid";
import FormulaForm from "components/formulaForm";
import gsap from "gsap";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdOutlinePets } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import Swal from "sweetalert2";
import BarLoader from "react-spinners/BarLoader";
import { useRouter } from "next/router";
import logo from "../public/img/logo_kleanvet_Mesa de trabajo 1.svg";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

// import Submit from "compoents/Submit";
const present = [
  "Frasco (1%) 15 mL 150 mg",
  "Frasco (2%) 15 mL 300 mg",
  "Frasco (1%) 30 mL 300 mg",
  "Frasco (2%) 30 mL 600 mg",
];
const diag = [
  "ANSIEDAD",
  "CANCER",
  "EMESIS",
  "INAPETENCIA",
  "CONDICIONES GERIATRICAS",
  "PATOLOGIAS ARTICULARES",
  "DOLOR",
  "COMPORTAMIENTO",
  "CONDICIONES NEURODEGENERATIVAS",
  "ENF. RENAL",
  "EPILEPSIA",
  "INFLAMACION",
  "DISFUNCION COGNITIVA",
  "SALUD CARDIOVASCULAR",
  "SISTEMA INMUNOLOGICO",
  "TRASTORNO GASTORINTESTINAL",
  "TRASTORNO DE MOVILIDAD",
  "ESTRÉS",
];

const personalizado = ["NO", "SI"];
const genre = ["Macho", "Hembra"];
const petTypes = ["Felino", "Canino"];
const validateEmail = (e) => {
  // console.log("validatig");
  e.target.value = e.target.value.replace(/\s/g, "");
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value);
};

// const veterinaryForm = {
//   label: "🏥 VETERINARIO",
//   inputs: {
//     name: {
//       label: "Nombre MD. Veterinario",
//       props: { placeholder: "Nombre" },
//       validate: (e) => {
//         return true;
//       },
//     },
//     card: {
//       label: "No. Tarjeta Profesional",
//       props: { placeholder: "Tarjeta Profesional" },
//       validate: (e) => {
//         return true;
//       },
//     },
//     address: {
//       label: "Direccion",
//       props: {
//         placeholder: "Direccion",
//       },
//       validate: (e) => {
//         return true;
//       },
//     },
//     location: {
//       label: "Ubicación",
//       props: { placeholder: "Ubicacion" },
//       validate: (e) => {
//         return true;
//       },
//     },
//     neighborhood: {
//       label: "Barrio",
//       props: {
//         placeholder: "Barrio",
//       },
//       validate: (e) => {
//         return true;
//       },
//     },
//     telephone: {
//       label: "Telefono",
//       props: { placeholder: "Telefono" },
//       validate: (e) => {
//         return true;
//       },
//     },
//     email: {
//       label: "Email",
//       props: { placeholder: "Email", type: "email" },
//       validate: validateEmail,
//     },
//     id: {
//       label: "Cedula",
//       props: { placeholder: "Cedula" },
//       validate: (e) => {
//         return true;
//       },
//     },
//   },
// };
const propietaryForm = {
  label: <><IoPersonSharp /> PROPIETARIO</>,
  inputs: {
    id: {
      label: "Cédula",
      props: { placeholder: "Cédula" },
      validate: (e) => {
        return true;
      },
    },
    name: {
      label: "Nombres",
      props: { placeholder: "Nombres" },
      validate: (e) => {
        return true;
      },
    },
    surname: {
      label: "Apellidos",
      props: { placeholder: "Apellidos" },
      validate: (e) => {
        // return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,10}\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,10}$/
        return true;
      },
    },
    telephone: {
      label: "Telefono",
      props: { placeholder: "Telefono" },
      validate: (e) => {
        return true;
      },
    },
    address: {
      label: "Direccion",
      props: {
        placeholder: "Direccion",
      },
      validate: (e) => {
        return true;
      },
    },
    neighborhood: {
      label: "Barrio",
      props: {
        placeholder: "Barrio",
      },
      validate: (e) => {
        return true;
      },
    },
    location: {
      label: "Ciudad",
      props: { placeholder: "Ciudad" },
      validate: (e) => {
        return true;
      },
    },
    department: {
      label: "Departamento",
      props: { placeholder: "Departamento" },
      validate: (e) => {
        return true;
      },
    },
    email: {
      label: "Email",
      props: { placeholder: "Email", type: "email" },
      validate: (e) => {
        return true;
        // validateEmail(e)
      },
    },
  },
};
const petForm = {
  label: <><MdOutlinePets /> MASCOTA</>,
  inputs: {
    name: {
      label: "Paciente",
      props: { placeholder: "Nombre" },
      validate: (e) => {
        return true;
      },
    },
    specie: {
      label: "Especie",
      props: {},
      options: petTypes,
      validate: (e) => {
        return true;
      },
    },
    weight: {
      label: "Peso (kg.)",
      props: { placeholder: "Peso" },
      validate: (e) => {
        return true;
      },
    },
    age: {
      label: "Edad (años)",
      props: { placeholder: "Edad", type: "number" },
      validate: (e) => {
        return true;
      },
    },
    breed: {
      label: "Raza",
      props: { placeholder: "Raza" },
      validate: (e) => {
        return true;
      },
    },
    sex: {
      label: "Sexo",
      props: {},
      options: genre,
      validate: (e) => {
        return true;
      },
    },
  },
};
const consultationForm = {
  label: "🩺 CONSULTA",
  label: <><HiBuildingOffice2 /> CONSULTA</>,
  inputs: {
    diagnostic: {
      label: "Diagnostico",
      props: {},
      options: diag,
      validate: (e) => {
        return true;
      },
    },
    presentation: {
      label: "Presentación",
      props: {},
      options: present,
      validate: (e) => {
        return true;
      },
    },
    units: {
      label: "Unidades",
      props: { type: "number", step: 1, min: 1, max: 6 },

      // options: diag,
      validate: (e) => {
        return true;
      },
    },
  },
};

const consultationForm2 = {
  label: <><BsPencilSquare /> PERSONALIZA LA PRESCRIPCIÓN</>,
  inputs: {
    personalize: {
      label: "Personalizar",
      props: {},

      validate: (e) => {
        return true;
      },
    },
  },
};
const form = {
  // veterinary: veterinaryForm,
  owner: propietaryForm,
  pet: petForm,
  consultation: consultationForm,
  consultapersonalizada: consultationForm2,
};

/* attachments: {
    label: "🖇️ ADJUNTAR",
    inputs: {
      notes: {
        props: { type: "text-area" },
        label: "NOTAS",
      },
      // media: {
      //   label: "Medios",
      // },
    },
  }, */
export default forwardRef(function Formula(
  { onCreated = () => {}, userInfo },
  ref
) {
  const router = useRouter();
  const { prescriptionPersonalizeData, prescriptions } = useMain();
  const [delivery, setDelivery] = useState("");
  const [isPersonalize, setIsPersonalize] = useState(false);
  const [formulae, setFormulae] = useState({
    // veterinary: {
    //   name: "" || userInfo.name,
    //   card: "" || userInfo.card,
    //   address: "" || userInfo.address,
    //   location: "" || userInfo.location,
    //   telephone: "" || userInfo.telephone,
    //   email: "" || userInfo.email,
    //   id: "" || userInfo.id,
    //   neighborhood: "" || userInfo.neighborhood,
    // },
    owner: {
      name: "",
      surname: "",
      department: "",
      location: "",
      address: "",
      telephone: "",
      email: "",
      id: "",
      neighborhood: "",
    },
    pet: {
      name: "",
      specie: "",
      weight: 1,
      age: 1,
      sex: "",
      breed: "",
    },
    consultation: {
      diagnostic: "",
      presentation: "",
      units: 1,
    },
    // consultapersonalizada: {
      // diagnostic: "",
      // presentation: "",
      // units: 1,
    // },
    attachments: {
      notes: "",
    },
    deliveryAddress: delivery,
  });

  const {
    pet: { weight },
    consultation: { diagnostic, presentation, units },
  } = formulae;

  useEffect(() => {
    setFormulae({ ...formulae, ["veterinary"]: { ...userInfo } });
  }, [userInfo]);

  useEffect(() => {
    myCallback();
  }, [delivery]);

  const handleSwitch = (e) => {
    setPersonalizePrescription({
      ...prescriptionPersonalizeData,
      ["personalize"]: e ? "SI" : "NO",
    });
    setIsPersonalize(e);
  };
  const myCallback = async () => {
    /* toast.success("Creando Prescripción", {
      position: toast.POSITION.TOP_CENTER,
    }) */
    if (delivery === "") {
      return;
    }
    toast.success("Creando Prescripción", {
      position: toast.POSITION.TOP_CENTER,
    });
    const finalFormula = {
      ...formulae,
      ["deliveryAddress"]: delivery,
      ["prescriptionPersonalizeData"]: { ...prescriptionPersonalizeData },
    };
    // prescriptionPersonalizeData.personalize === "SI"

    setGenerating(true);
    try {
      console.log("Final formula Print", finalFormula);
      await axios.post("api/mailerNotifier", finalFormula);
      const result = await axios.post("api/prescription", finalFormula);
      // console.log('result',result.data)
      // console.log('prescriptions',prescriptions)

      // console.log(prescriptions,'prescriptions after push')
      /* setPrescription2(prescriptions) */
      setPrescription2([...prescriptions, result.data]);
      /*  onCreated(result.data); */
      setGenerating(false);
      setDelivery("");
      setPersonalizePrescription({
        personalize: "NO",
        week1: "",
        week2: "",
        week3: "",
        week4: "",
      });
      /* setFormulae({
        owner: {
          name: "Carlos",
          department: "dsdaadsads",
          location: "dasasddas",
          address: "dsaasddas",
          telephone: "3158739953",
          email: "a@gmail.com",
          id: "11122211",
          neighborhood: "ssdasdasdadssda",
        },
        pet: {
          name: "sdadsa",
          specie: "aadsdas",
          weight: 10,
          age: 10,
          sex: "sasaa",
          breed: "asassa",
        },
        consultation: {
          diagnostic: "ANSIEDAD",
          presentation: "",
          units: "1",
        },
        consultapersonalizada:{
          diagnostic: "",
          presentation: "",
          units: 1,
        },
        attachments: {
          notes: "",
        },
        deliveryAddress: delivery,
      }) */
      router.reload();
      /* router.reload() */
      /* close();
      router.replace("/dashboard") */
    } catch (error) {
      console.error("HUBO UN ERROR", error.response.data); // NOTE - use "error.response.data` (not "error")
    }
  };
  useEffect(() => {
    // console.log(form);
    setFormulae({ ...formulae, ["veterinary"]: { ...userInfo } });
  }, []);

  const refactorNameSurname = (inputText) => {
    inputText = inputText.replace(/  +/g, " ");
    inputText = inputText.replace(/[^a-zA-Z ]+/, "");
    var splitStr = inputText.toLowerCase().split(" ");
    splitStr = splitStr.slice(0, 2);
    for (var i = 0; i < splitStr.length; i++) {
      if (splitStr[i].length > 10) {
        splitStr[i] = splitStr[i].slice(0, 10);
      }
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  const validateName = (e) => {
    const inputText = e.target.value;
    state.user.info.name = refactorNameSurname(inputText);
    e.target.value = state.user.info.namesss;
    onFinishTyping(() => {
      const valid = e.target.value.length >= 3;
      if (valid) {
        setValidationStatus("name", true, "Valid name");
      } else {
        state.user.info.name = null;
        setValidationStatus("name", false, "Name is too short");
      }
    });
  };

  const validateSurname = (e) => {
    var inputText = e.target.value;
    e.target.value = refactorNameSurname(inputText);

    onFinishTyping(() => {
      const valid = e.target.value.length >= 2;
      if (valid) {
        setValidationStatus("surname", true, "Valid surname");
        state.user.info.surname = e.target.value;
      } else {
        setValidationStatus("surname", false, "Surname is too short");
        state.user.info.surname = null;
      }
    });
  };
  const [generating, setGenerating] = useState(false);
  const [shown, setShown] = useState(false);
  const serial = useRef();

  const open = () => {
    setFormulae({ id: nanoid(), ...formulae });
    // serial.current = nanoid(10);
    setShown(true);
  };

  useEffect(() => {
    shown && gsap.to("#formula", { duration: 0.2, opacity: 1 });
  }, [shown]);

  const close = async () => {
    await gsap.to("#formula", { duration: 0.2, opacity: 0 });
    setShown(false);
  };

  useImperativeHandle(ref, () => {
    return {
      open: () => open(),
      close: () => close(),
    };
  });

  const handleInput = (e, cat, key) => {
    if (cat !== "consultapersonalizada") {
      const validation = form[cat].inputs[key].validate;
      if (!validation || validation(e)) {
        setFormulae({
          ...formulae,
          [cat]: { ...formulae[cat], [key]: e.target.value },
        });
      } else {
        setFormulae({
          ...formulae,
          [cat]: { ...formulae[cat], [key]: undefined },
        });
      }
    }
  };

  // const getRecalculate = async (weight,diagnostic,presentation) => {
  const getRecalculatePrescription = async (dataDTO) => {
    console.log("getRecalculatePrescription");
    if (dataDTO)
      try {
        const { weight, diagnostic, presentation, units } = dataDTO;
        let result;
        // const resp = ()=>
        weight && diagnostic && presentation && units
          ? (result = await axios.post("api/recalculatePrescription", dataDTO))
          : [];
        return result;
      } catch (error) {
        console.log("OCURRIÓ UN ERROR", error);
      }
  };

  useEffect(() => {
    const dataDTO = { weight, diagnostic, presentation, units };
    let result;
    //waiting for data to set it on PersonalizePrescriptions
    async function getData() {
      try {
        result = await getRecalculatePrescription(dataDTO);
        if (result) {
          const { data } = result.data;
          // console.log("DATA LLEGANDO", data);
          setPersonalizePrescription({
            ...prescriptionPersonalizeData,
            ["personalize"]: "NO",
            ["week1"]: data.week1,
            ["week2"]: data.week2,
            ["week3"]: data.week3,
            ["week4"]: data.week4,
          });
        }
      } catch (error) {
        result = error;
      }
    }
    getData();
  }, [weight, presentation, diagnostic, units]);
  var formValid = !Object.entries(form)
    .filter((e) => !e.includes("consultapersonalizada"))
    .some(([categoryKey, category]) =>
      Object.entries(category.inputs).some(
        ([inputKey, input]) =>
          !(formulae[categoryKey] && formulae[categoryKey][inputKey])
      )
    );

  // Get user/client ddress or personalize delivery
  const getDeliveryAddress = () => {
    Swal.fire({
      title: "¿A qué dirección desea recibir el producto?",
      input: "select",
      inputOptions: {
        "vetAddress":`Mi dirección: ${ userInfo.address}`,
        "clientAddress": `Cliente: ${formulae.owner.address}`,
        "customAddress": "Editar dirección de entrega",
      },
      inputPlaceholder: "Seleccione una dirección",
      confirmButtonColor: "#fd7238",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value) {
          if (value.includes("vetAddress")) {
            setDelivery({
              id:userInfo.id,
              name:userInfo.name,
              department: userInfo.department,
              location: userInfo.location,
              address: userInfo.address,
              telephone: userInfo.telephone,
              neighborhood:userInfo.neighborhood
            });
          } else if (value.includes("clientAddress")) {
            setDelivery({
              id:formulae.owner.id,
              name:formulae.owner.name,
              department: formulae.owner.department,
              location: formulae.owner.location,
              address: formulae.owner.address,
              telephone: formulae.owner.telephone,
              neighborhood:formulae.owner.neighborhood
            });
          }
        } else {
          return "Debes elegir una opción";
        }
      },
    }).then(
      ({ value }) =>
        value?.includes("customAddress") &&
        Swal.fire({
          icon: "info",
          title: "Ingrese los datos",
          // inputAttributes:{
          //   class:`${styles.input_swalt}`
          // },
          html: `
           <div class=${styles.inputs_container}>
           <div><label> Nombre:<input id="name" class=${styles.input_swalt} placeholder="Nombre" /></label></div>
           <div><label> Cédula:<input id="id" class=${styles.input_swalt} placeholder="Cédula" /></label></div>
            <div><label> Departamento:<input id="department" class=${styles.input_swalt} placeholder="Departamento"/></label></div>
            <div><label> Ciudad:<input id="location" class=${styles.input_swalt} placeholder="Ciudad" /></label></div>
            <div><label> Barrio:<input id="neighborhood" class=${styles.input_swalt} placeholder="Barrio" /></label></div>
            <div><label> Dirección:<input id="address" class=${styles.input_swalt} placeholder="Dirección" /></label></div>
            <div><label> Celular:<input id="telephone" class=${styles.input_swalt} placeholder="Celular" /></label></div>
            
           </div>`,
            
          confirmButtonColor: "#fd7238",
          showCancelButton: true,
          preConfirm: () => {
            const department = document.getElementById("department").value;
            const location = document.getElementById("location").value;
            const address = document.getElementById("address").value;
            const telephone = document.getElementById("telephone").value;
            const id = document.getElementById("id").value;
            const name = document.getElementById("name").value
            const neighborhood = document.getElementById("neighborhood").value

            if (!department || !location || !address || !telephone || !id || !name || !neighborhood ) {
              Swal.showValidationMessage("¡Completa tus datos!");
            }
            return { department, location, address, telephone, id, name, neighborhood };
          },
        })
        // .then((resp) => console.log('RESP', resp))
         .then((resp) => (resp.value ? setDelivery(resp.value) : ""))
    );
  };
  return (
    shown && (
      <>
        {/* <ToastContainer/> */}
        <div
          id="formula"
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            zIndex: "20",
            maxHeight: "100vh",
            height: "100vh",
            backdropFilter: "blur(10px)",
            color: "silver",
            display: "flex",
            flexDirection: "column",
          }}
          className={styles.main}
        >
          <div
            style={{
              background: "white",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              borderBottom: "2px solid rgb(100,100,100)",
              gap: "20px",
              backgroundColor: "#eee",
            }}
          >
            <h2
              style={{
                marginBottom: "",
                color: "black",
                backgroundColor: "#eee",
              }}
            >
              📋 Crear prescripción
            </h2>
            <div style={{ flex: 1 }}>{serial.current}</div>
            <i onClick={close} className="uil uil-signout">
              <AiFillCloseCircle color="#ff8000" size={30} />
            </i>
            {/* <button onClick={close} style={{ width: "60px" }}>
                X
              </button> */}
          </div>
          <div className={styles.vetForms}>
            {Object.entries(form).map(([categoryKey, category]) => (
              <FormulaForm
                key={categoryKey}
                data={formulae[categoryKey]}
                categoryKey={categoryKey}
                category={category}
                disabled={generating}
                handleInput={handleInput}
                isPersonalize={isPersonalize}
                handleSwitch={handleSwitch}
              />
            ))}
            <div className={styles.vetForm}>
              {false && (
                <pre
                  style={{
                    flex: "1",
                    background: "rgb(10,10,10)",
                    overflowX: "hidden",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {JSON.stringify(formulae, null, 2)}
                </pre>
              )}
              <div style={{ flex: "1" }}>
                {formValid
                  ? "FORMULARIOS VALIDOS"
                  : "DEBES LLENAR TODOS LOS CAMPOS"}
              </div>
              <button
                className={styles.submit_button}
                disabled={!formValid || generating}
                onClick={() => {
                  getDeliveryAddress();
                }}
              >
                GENERAR PRESCRIPCION
              </button>
              {/* unaba */}
            </div>
          </div>
        </div>
      </>
    )
  );
});
// {
//   Object.keys(category.inputs).some(
//     ([inputKey, input]) =>
//       !(formulae[categoryKey] && ljlkjlformulae[categoryKey][inputKey])
//   )
//     ? "🔼 FALTA INFORMACION"
//     : "✔️ INFORMACION COMPLETA";
// }
//
//
// const validateBirthDay = (e) => {
//   if (e.target.value) {
//     state.user.info.birthday = e.target.value;
//     setValidationStatus("birthday", true, "Valid Date");
//   } else {
//     state.user.info.birthday = null;
//     setValidationStatus("birthday", false, "Invalid Date");
//   }
// };
// const validateCell2 = (value, data) => {
//   onFinishTyping(() => {
//     var rawNumber = value.replace(/[^0-9]+/g, "");
//     var reqLen = 20;
//     rawNumber = rawNumber.slice(
//       data.dialCode.length,
//       data.dialCode.length + reqLen
//     );
//     var number = data.dialCode + " - " + rawNumber;
//     number = "+" + number;
//     const phoneNumber = parsePhoneNumberFromString(number);
//     const valid =
//       rawNumber.length > 5 &&
//       phoneNumber != undefined &&
//       phoneNumber.isValid();
//     if (valid) {
//       setValidationStatus("cell", true, "Valid number");
//       state.user.info.cell = number;
//     } else {
//       setValidationStatus("cell", false, "Invalid number");
//       state.user.info.cell = null;
//     }
//   });
// };
// const onFinishTyping = (callBack) => {
//   self.validationTimeout = setTimeout(callBack, 500);
// };
// const onFinishTyping = (callBack) => {
//   self.validationTimeout = setTimeout(callBack, 500);
// };

/* const result1 = await axios.post("http://localhost:3005/file_process", { hello: 'world' },{
                  headers: {
                    // 'application/json' is the modern content-type for JSON, but some
                    // older servers may use 'text/json'.
                    // See: http://bit.ly/text-json
                    'content-type': 'application/json'
                  }
                }); */
/* const result1 = await axios.post("api/prescription",formulae); */
/* const result1 = await axios.post("api/prescription2", {text:'epa la arepa'}); */
/* setGenerating(false);
                close();
                return false */
/*  const result = await axios.post("api/prescription", formulae);
                console.log(result,'--------------------------------------------------')
                console.log(formulae) */
// console.log(result);
// const blob = new Blob([result.data], {
//   type: "application/pdf",
// });
// const a = document.createElement("a");
// a.href = window.URL.createObjectURL(blob);
// a.download = `${formulae.id}.pdf`;
// a.click();
// setPDF(blob.preview)
/* console.log(result.data); */
