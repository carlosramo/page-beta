import styles from "styles/Formula.module.css";
import axios from "axios";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { subscribe,watch } from "valtio";
import {useMain, setPersonalizePrescription,setPrescription2,} from "../vStore/main";
import { nanoid } from "nanoid";
import FormulaForm from "components/formulaForm";
import gsap from "gsap";
import { AiFillCloseCircle, AiOutlineUser } from "react-icons/ai";
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
  "CONDICIONES GERIATRICASNCIA",
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

const personalizado = [
  "NO",
  "SI",

];
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
  label: "PROPIETARIO",
  inputs: {
    name: {
      label: "Propietario",
      props: { placeholder: "Nombre" },
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
    location: {
      label: "Municipio",
      props: { placeholder: "Municipio" },
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
    telephone: {
      label: "Telefono",
      props: { placeholder: "Telefono" },
      validate: (e) => {
        return true;
      },
    },
    email: {
      label: "Email",
      props: { placeholder: "Email", type: "email" },
      validate: validateEmail,
    },
    id: {
      label: "Cedula",
      props: { placeholder: "Cedula" },
      validate: (e) => {
        return true;
      },
    },
  },
};
const petForm = {
  label: "🐾 MASCOTA",
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
  label: "🩺 Personaliza la prescripción",
  inputs: {
    personalize: {
      label: "Personalizar",
      props: {},
      options: personalizado,
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
  consultapersonalizada:consultationForm2,
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
  { onCreated = () => {}, userInfo }, ref) {

    
    const router = useRouter();
  const { prescriptionPersonalizeData,prescriptions  } = useMain();
  const [delivery, setDelivery] = useState("");

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
  });

   useEffect(() => {
     setFormulae({ ...formulae, ["veterinary"]: {...userInfo} });
   }, [userInfo]);

  useEffect(() => {
    myCallback();
  }, [delivery]);

  const myCallback = async () => {
    /* toast.success("Creando Prescripción", {
      position: toast.POSITION.TOP_CENTER,
    }) */
    if (delivery === "") {
    } else {
      toast.success("Creando Prescripción", {
        position: toast.POSITION.TOP_CENTER,
      })
      let finalFormula = { ...formulae, ["deliveryAddress"]: delivery };
      if(prescriptionPersonalizeData.personalize === 'SI'){
        // console.log('SE DEBE MODIFICAR FORMULAE')
        // console.log(prescriptionPersonalizeData)
        finalFormula = { ...formulae, ["prescriptionPersonalizeData"]: {...prescriptionPersonalizeData} };
        // console.log('FINAL',finalFormula)
        /* finalFormula = { ...formulae, ["prescriptionPersonalizeData"]: prescriptionPersonalizeData }; */
    } 
      setGenerating(true);
      try {
        console.log('Final formula Print',finalFormula)
        await axios.post("api/mailerNotifier", finalFormula);
        const result = await axios.post("api/prescription", finalFormula);
        // console.log('result',result.data)
        // console.log('prescriptions',prescriptions)
        
        // console.log(prescriptions,'prescriptions after push')
        /* setPrescription2(prescriptions) */
         setPrescription2([...prescriptions, result.data]) 
        /*  onCreated(result.data); */
        setGenerating(false);
        setDelivery("");
        setPersonalizePrescription({
          personalize:"NO",
          week1:"",
          week2:"",
          week3:"",
          week4:"",
        })
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
        router.reload()
        /* router.reload() */
        /* close();
        router.replace("/dashboard") */
        
        
        
        
      } catch (error) {
        console.error("HUBO UN ERROR", error.response.data); // NOTE - use "error.response.data` (not "error")
      }
    }
  };
  useEffect(() => {
    console.log(form)
    setFormulae({ ...formulae, ["veterinary"]: {...userInfo} });
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
  };


  var formValid = !Object.entries(form).some(([categoryKey, category]) =>
    Object.entries(category.inputs).some(
      ([inputKey, input]) =>
        !(formulae[categoryKey] && formulae[categoryKey][inputKey])
    )
  );

  const getDeliveryAddress = () =>
    Swal.fire({
      title: "¿A que dirección desea recibir el producto?",
      input: "select",
      inputOptions: {
        vetAddress: userInfo.address,
        clientAddress: formulae.owner.address,
      },
      inputPlaceholder: "Seleccione una dirección",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value) {
          value.includes("vetAddress")
            ? setDelivery(userInfo.address)
            : setDelivery(formulae.owner.address);
        } else {
          return "Debes escoger una dirección";
        }
      },
    });
  return (shown && (
    <>
          {/* <ToastContainer/> */}
          <div
            id="formula"
            style={{
              position: "fixed",
              top: "0px",
              left: "0px",
              zIndex: "20",
              background: "rgba(43, 213, 202, 0.9)",
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
                gap: "20px"
                ,backgroundColor:'#eee'
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
          ))

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



