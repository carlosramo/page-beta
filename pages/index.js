import { useState, useRef, useEffect } from "react";
import Image from 'next/image'
import Router from "next/router";
import { useRouter } from "next/router";
/* import { signIn } from 'next-auth/client'; */
import { proxy, useSnapshot } from "valtio";
import Swal from "sweetalert2";
import { signIn, useSession, signOut,getSession } from "next-auth/react";

import logo2 from "../public/img/veterinarios.svg";
import cats from "../public/img/cats.svg";
import google from "../public/img/google.svg";
import logo from "../public/img/logo_kleanvet_Mesa de trabajo 1.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarLoader from "react-spinners/BarLoader";
/* . */
const state = proxy({
  loading: false,
});
async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
}
function Login() {
  const session = useSession();
  useEffect(() => {
    // Your code here
    setEmail("");
    setPassword("");
  }, []);
  // const { session, status } = useSession();
  // console.log("session");
  // console.log(session);
  // if (status === "authenticated") {
  //   Router.replace("/dashboard");
  // }
  const snap = useSnapshot(state);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Errors, setErrors] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }
  const ref = useRef();
  let myDiv = useRef();
  function myClick() {
    console.log(myDiv.current);
    /*  myDiv.current.classList.add('sign-up-mode') */
  }
  function register() {
    myDiv.current.classList.add("sign-up-mode");
  }
  function login() {
    myDiv.current.classList.remove("sign-up-mode");
  }
  async function submitHandlerRegister(event) {
    
    /* console.log('submitHandlerRegister') */
    event.preventDefault();
    
    const enteredEmail = userEmail.toLowerCase().trim();
    const enteredPassword = password.trim();
    /* console.log(Errors) */
    if (handledErrror(enteredEmail, enteredPassword)) {
      state.loading = true;
      Swal.fire({
        title: 'Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de North Success Developments SAS',
        html:
                'Puede revisar la política de privacidad en el siguiente link, ' +
                '<a href="//klean-vet.com/politica-privacidad/">Política de privacidad</a> ',
        showDenyButton: true,
        confirmButtonColor:'#ff8000',
        confirmButtonText: 'Aceptar',
        denyButtonText: 'No Aceptar',
        customClass: {
          actions: 'my-actions',
         
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const result = await createUser(enteredEmail, enteredPassword);
            // console.log("registro");
            // console.log(result);
            if (result.status === 201) {
              // console.log("HEYYY");
              setEmail("");
              setPassword("");
              state.loading = false;
              Swal.fire({
                title:'Buen trabajo te has registrado!',
                showDenyButton: false,
        confirmButtonColor:'#ff8000',
        confirmButtonText: 'Aceptar',
                
              }
              );
              // Router.replace("/dashboard");
                
            } else {
              setEmail("");
              setPassword("");
              state.loading = false;
            }
          } catch (error) {
            state.loading = false;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "El usuario ya existe, por favor ve a la sección de ingreso!",
              
              /* footer: '<a href="">No recuerdo mi contraseña?</a>' */
            });
          }

        }else if (result.isDenied) {
          state.loading = false;
          Swal.fire('No puede utilizar la aplicación sin aceptar los terminos y condiciones', '', 'info')
        }})
      
    }
  }
  async function submitHandlerLogin(event) {
    event.preventDefault();
    const enteredEmail = userEmail.toLowerCase().trim();
    const enteredPassword = password.trim();
    if (handledErrror(enteredEmail, enteredPassword)) {
      state.loading = true;
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword
        });
        // console.log('status login')
        console.log('RESULT')
          console.log( result)
        if (result.status === 200) {
          const {user} = await getSession()
          console.log('user',user)
          /* const { data, status } = session;//SESSION YA ESTA LISTO
          console.log('DATA', data)
          
          console.log('data && status.includes("authenticated")')
          console.log(data && status.includes("authenticated")) */
          if (user) {
            setEmail("");
            setPassword("");
            console.log('data.user.role && data.user.role.includes("Admin")')
          console.log(user.role && user.role.includes("Admin"))
            user.role && user.role.includes("Admin")
              ? router.replace("/admin-dashboard")
              : router.replace("/dashboard")
          }else{
            console.log('RESULT')
          console.log( result)
          }
            /* else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Hubo un problema intentalo de nuevo!",
            });
            router.reload()
            
          } */
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Credenciales erroneas vuelve a intentarlo!",
            /* footer: '<a href="">No recuerdo mi contraseña?</a>' */
          });
          state.loading = false;
          setEmail("");
          setPassword("");
        }
        // console.log(result);
      } catch (error) {
        // console.log('error')
        // console.log(error);
      }
    }
  }
  function handledErrror(email, password) {
    const errors = {};
    if (!email || !email.includes("@")) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Debe ingresar su correo",
      }));
      /* setErrors({email:'Debe ingresar su correo'}) */
    } else if (!password) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Debe ingresar una contraseña",
        email: "",
      }));
      /* setErrors({password:'Debe ingresar su correo'}) */
    } else {
      setErrors({ email: "", password: "" });
      return true;
    }
  }
  async function loginGoogle() {
    Swal.fire({
      title: 'Autorizo el tratamiento de mis datos personales conforme a la política de privacidad de North Success Developments SAS',
      html:
              'Puede revisar la política de privacidad en el siguiente link, ' +
              '<a href="//klean-vet.com/politica-privacidad/">Política de privacidad</a> ',
      showDenyButton: true,
      confirmButtonColor:'#ff8000',
      confirmButtonText: 'Aceptar',
      denyButtonColor:'#1f8f8a',
      denyButtonText: 'No Aceptar',
      customClass: {
        actions: 'my-actions',
       
        confirmButton: 'order-2',
        denyButton: 'order-3',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Acepto los terminos y condiciones de uso de la plataforma',
          html:
              'Puede revisar la política de privacidad en el siguiente link, ' +
              '<a href="//klean-vet.com/politica-privacidad/">Política de privacidad</a> ',
          showDenyButton: true,
         confirmButtonColor:'#ff8000',
          confirmButtonText: 'Aceptar',
          denyButtonColor:'#1f8f8a',
          denyButtonText: 'No Aceptar',
          customClass: {
            actions: 'my-actions',
           
            confirmButton: 'order-2',
            denyButton: 'order-3',
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await signIn("google",{
                /* `http://localhost:3000/dashboard` */
                /*  `https://klean-vet.herokuapp.com/dashboard` */
                /* `http://localhost:3000/dashboard` */
                // callbackUrl: `https://klean-vet.herokuapp.com/dashboard`,
                /* https://kleanvet-testing.herokuapp.com/ */
                callbackUrl: `https://app.klean-vet.com/dashboard`,
              });
            } catch (error) {}
          } else if (result.isDenied) {
            Swal.fire('No puede utilizar la aplicación sin aceptar los terminos y condiciones', '', 'info')
          }
        })
      
      } else if (result.isDenied) {
        Swal.fire('No puede utilizar la aplicación sin aceptar los terminos y condiciones', '', 'info')
      }
    })
    
  }
  return (
    <>
      {state.loading === true ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              marginTop: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Image src={logo} style={{ marginBottom: "10px" }}  alt="logo-klean-vet"/>
            <BarLoader color="#36d7b7" />
          </div>
        </div>
      ) : (
        <div ref={myDiv} className="container">
          <div className="forms-container">
            <div className="signin-signup">
              <form
                onSubmit={submitHandlerLogin}
                action="#"
                className="sign-in-form"
              >
                <Image src={logo} style={{ marginBottom: "10px" }} />
                <h2 className="vet_subtitle">Ingreso a veterinarios</h2>
                <p className="vet_text">
                  Ingrese al software de prescripción de Klean-Vet® Si aún no
                  esta registrado,{" "}
                  <span
                    style={{ color: "#2bd5ca", textDecoration: "underline" }}
                    onClick={() => register()}
                  >
                    haga clic aquí para crear su cuenta
                  </span>
                </p>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Correo"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {Errors.email != "" && (
                  <p style={{ color: "red" }}>{Errors.email}</p>
                )}
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {Errors.password != "" && (
                  <p style={{ color: "red" }}>{Errors.password}</p>
                )}
                <input type="submit" value="Ingresa" className="btn solid" />
                <p className="social-text">O inicia sesión con Google</p>
                <div className="social-media">
                  <a href="#">
                    <Image
                      onClick={() => loginGoogle()}
                      src={google}
                      className="social-icon"
                    />
                  </a>
                  
                </div>
                <a href="//klean-vet.com/politica-privacidad/" style={{margin:'10px'}}>Política de privacidad</a>
              </form>
              <form
                onSubmit={submitHandlerRegister}
                action="#"
                className="sign-up-form"
              >
                <h2 className="title">Registrate</h2>
                {/* <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Usuario" />
            </div> */}
                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Correo"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {Errors.email != "" && (
                  <p style={{ color: "red" }}>{Errors.email}</p>
                )}
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {Errors.password != "" && (
                  <p style={{ color: "red" }}>{Errors.password}</p>
                )}
                <input type="submit" className="btn" value="Registrarme" />
                <p className="social-text">O registrate con Google</p>
                <div className="social-media">
                  {/* <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a> */}
                  <a href="#">
                    <Image
                      onClick={() => loginGoogle()}
                      src={google}
                      className="social-icon"
                      alt="login-google-klean-vet"
                    />
                    {/* <i className="fab fa-linkedin-in"></i> */}
                  </a>
                </div>
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h2 className="left_panel-title">Regístrese como veterinario prescriptor</h2>
                <p  className="left_panel-text">
                  Comience a prescribir Klean-Vet® a las mascotas.
                </p>
                <button
                  onClick={() => register()}
                  ref={ref}
                  className="btn solid"
                  id="sign-up-btn"
                >
                  Registrate
                </button>
              </div>
              <Image src={logo2} className="image" alt="registrate-klean-vet" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>Ya estas registrado ?</h3>
                <p>Dale click a ingresar y coloca tus credenciales.</p>
                <button
                  onClick={() => login()}
                  className="btn transparent"
                  id="sign-in-btn"
                >
                  Ingresa
                </button>
              </div>
              {/* <Image src={cats} className="image" alt="" /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Login;
