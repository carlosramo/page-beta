import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Router from "next/router";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import profile from "../public/img/Profile.svg";
import wprofile from "../public/img/girl.png";
import PetForm from "../src/database/petform";
import BarLoader from "react-spinners/BarLoader";
import logo from "../public/img/logo_kleanvet_Mesa de trabajo 1.svg";
import { FaHeart, FaRegHeart, FaHome } from "react-icons/fa";
import { AwesomeButton } from "react-awesome-button";
import {
  AiFillCloseCircle,
  AiOutlineUser,
  AiOutlineDownload,
  AiOutlineLeft,
} from "react-icons/ai";
import styleButton from "../styles/Button.module.scss";
import "react-awesome-button/dist/styles.css";
import Modal from "../src/database/components/modal";
import Profileimg from "../public/img/Profile.svg";
import moment from "moment";
// const Formula = dynamic(() => import("../components/formula"), { ssr: false });
import Formula from "components/formula";
import Search from "components/Search";
import axios from "axios";
import { useMain, setPrescriptions, setUserInfo } from "vStore/main";
import { getUserInfo } from "lib/models/assets";
import Perfil from "components/Profile";
import { watch } from "valtio/utils";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import CardViewPrescriptions from "components/cardViewPrescriptions";
import { swaltMiddleware, welcomeAlert } from "components/helpers/swaltHelpers";
import styles from '../styles/Formula.module.scss'
export default function Dashboard({ initialAssets }) {
  
  const { prescriptions, searchResult, userInfo } = useMain();
  const [showModal,setShowFisrtModal] = useState(false);

  const [localUserInfo,setLocalUserInfo] = useState(JSON.parse(initialAssets).userInfo);
  const [localPrescription, setLocalPrescriptions] = useState(JSON.parse(initialAssets).prescriptionPagination.results);
  const [currentPage, setCurrentPage] = useState(JSON.parse(initialAssets).prescriptionPagination.currentPage);
  const [currentPageSize, setCurrentPageSize] = useState(JSON.parse(initialAssets).prescriptionPagination.totalPages);
  console.log('iniciando Dashbpard')
  console.log('localPrescription',localPrescription)
  console.log('initial State',JSON.parse(initialAssets))
  // useSnapshot({ ...proxy, userInfo });
  const router = useRouter();
  const formula = useRef();
  const buttonStates = [
    "Prescripciones Registradas",
    "En Proceso",
    "Prescripciones Pagadas",
  ];
  const [buttonState, setButtonState] = useState(buttonStates[0]);
  const [downloadpdf, setDownloadingPdf] = useState(false);
  const { status, data } = useSession();
  const [userData, setUserData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);
  useEffect(()=>{
    setShowDashboard(true);
  },[showDashboard])
  useEffect(() => {
    if (status === "unauthenticated") {
      Router.replace("/");
    }
    if (status === "authenticated") {
      if (data.user.role && data.user.role === "Admin") {

        router.replace("/admin-dashboard");
      } else {
        setShowDashboard(true);
      }
    }
    console.log("USER", data);
  }, [status]);
  useEffect(() => {
    setPrescriptions(JSON.parse(initialAssets).prescriptions);
  }, []);
  useEffect(() => {
    setUserInfo(JSON.parse(initialAssets).userInfo);
    setUserData(JSON.parse(initialAssets).userInfo);
  }, []);

  const validateUserInfo = async () => {
    try {
      const response = await axios
        .get("/api/profile")
        .then(({ data }) => data.result)
        .then((result) => {
          setUserData(() => result.info);
          return !!result.info;
        });
        /* console.log('validateUserInfo',response) */
      return response;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const resp = async () => {
        
        (await validateUserInfo()) 
          ? ""
          : welcomeAlert().then((e) => e.value && router.replace("/profile"));
      };
      resp();
    }
  }, [status]);

  const descargando = () => {
    if (downloadpdf) {
      return (
        <>
        Descargando...
      <BarLoader color="#36d7b7" />
      </>)
    } else {
      return null;
    }
  };
  useEffect(() => {
    // you will get updated finalData here, each time it changes
    console.log('---useEffect Local prescriptionlocal',localPrescription);
    // you can trigger your function from here
    setLocalPrescriptions(localPrescription)
},[localPrescription,currentPage]);
  const getPrescriptionByPagePlus = async () => {
    if(currentPage+1>currentPageSize){
      return null
    }else{
      setCurrentPage(currentPage+1)
    const result = await axios.get(
      "api/prescriptionpaginator",
      {
        params: { 
          pageSize:currentPageSize,
          currentPage: currentPage+1,
          user: localUserInfo,
         },
      }
    );
    console.log('paginator result PLus', result.data.results)
    setLocalPrescriptions(result.data.results)
  }
    
  }

  const getPrescriptionByPageLess = async () => {
    if(currentPage-1===0){
      return null
    }else{
    setCurrentPage(currentPage-1)
    const result = await axios.get(
      "api/prescriptionpaginator",
      {
        params: { 
          pageSize:currentPageSize,
          currentPage: currentPage-1,
          user: localUserInfo,
         },
      }
    );
    console.log('paginator result Less', result.data.results)
    setLocalPrescriptions(result.data.results)
  }
  }
/* return (
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
        <Image
          alt="klean-vet-logo"
          src={logo}
          style={{ marginBottom: "10px" }}
        />
        <BarLoader color="#36d7b7" />
      </div>
    </div>
  ); */
  
    return (
      showDashboard && (
      <div>
        <ToastContainer />

        <Formula
          ref={formula}
          onCreated={(newPresc) => {
            /* setPrescriptions([...prescriptions, newPresc]); */
          }}
          userInfo={userData}
        />
        <nav>
          <div className="logo-name">
            <div className="logo-image">
              <Image
                alt="perfil klean-vet"
                width={200}
                height={40}
                src={Profileimg}
                style={{ marginBottom: "10px" }}
              />
              {/* <!--<img src="images/logo.png" alt="">--> */}
            </div>

            <span className="logo_name">Klean-Vet</span>
          </div>

          <div className="menu-items">
            <ul className="nav-links">
              <li>
                <Link href="/dashboard">
                  <i className="uil uil-estate">
                    <FaHome />
                  </i>
                  <span className="link-name">Inicio</span>
                </Link>
              </li>
              <li>
                {/* <Link href="/profile"> */}
                <Link href="/profile">
                  <i className="uil uil-files-landscapes">
                    <AiOutlineUser />
                  </i>
                  <span className="link-name">Perfil</span>
                </Link>
                {/* </Link> */}
              </li>
              {/* <li><a href="#">
                    <i className="uil uil-chart"></i>
                    <span className="link-name">Analytics</span>
                </a></li> */}
              {/* <li><a href="#">
                    <i className="uil uil-thumbs-up"></i>
                    <span className="link-name">Like</span>
                </a></li> */}
              {/* <li><a href="#">
                    <i className="uil uil-comments"></i>
                    <span className="link-name">Comment</span>
                </a></li> */}
              {/* <li><a href="#">
                    <i className="uil uil-share"></i>
                    <span className="link-name">Share</span>
                </a></li> */}
            </ul>

            <ul className="logout-mode">
              <li>
                <Link href="#">
                  <i onClick={() => signOut()} className="uil uil-signout">
                    <AiFillCloseCircle />
                  </i>
                  <span
                    onClick={() =>
                      signOut({
                        callbackUrl:'https://app.klean-vet.com',
                      })
                    }
                    className="link-name"
                  >
                    Cerrar Sesión
                  </span>
                </Link>
              </li>

              {/* <li className="mode">
                    <a href="#">
                        <i className="uil uil-moon"></i>
                    <span className="link-name">Dark Mode</span>
                </a>

                <div className="mode-toggle">
                  <span className="switch"></span>
                </div>
            </li> */}
            </ul>
          </div>
        </nav>

        <section className="dashboard">
          <div className="top">
            <i className="uil uil-bars sidebar-toggle"></i>

            {/* <!--<img src="images/profile.jpg" alt="">--> */}
          </div>
          <div></div>
          <div className="dash-content">
            <div className="overview">
              <div className="title">
                <i className="uil uil-tachometer-fast-alt"></i>
                <span className="text">Resumen </span>
              </div>

              <div className="boxes">
                <div className="box box1">
                  <i className="uil uil-thumbs-up"></i>
                  <span className="text">Prescripciones <br/>Registradas</span>
                  <span className="number">{prescriptions.length}</span>
                </div>
                {/* <div className="box box2">
                  <i className="uil uil-comments"></i>
                  <span className="text">En proceso</span>
                  <span className="number">0</span>
                </div>
                <div className="box box3 ">
                  <i className="uil uil-share"></i>
                  <span className="text">Prescripciones Pagadas</span>
                  <span className="number">0</span>
                </div> */}
              </div>
              <br />
              {/* <AwesomeButton classNameName={styleButton.awsbtn} >Registrar Prescripción</AwesomeButton> */}
            </div>

            <div className="activity">
              <div style={{ display: "flex", flexWrap:"wrap" }} className="title">
                <i className="uil uil-clock-three"></i>
                {/* <span style={{ flex: "1" }} className="text">
                  {buttonSt
                </span> */}
                <div style={{margin:'10px'}}>
                <button
                  
                  // onPress={async() => console.log('USERINFO', await validateUserInfo())}
                  onClick={async () =>
                    (await validateUserInfo())
                      ? formula.current.open()
                      : swaltMiddleware().then((res) =>
                          res.value ? router.replace("/profile") : ""
                        )
                  }

                  // onPress={async() => console.log('USERINFO',await  validateUserInfo()) }

                   className={styleButton.create_prescription}
                >
                  Crear Prescripción
                </button>
                </div>
                {/* <button style={{background:'#ff8000'}}>Registrar Prescripción</button> */}
              </div>
              {prescriptions.length ? (
                <div
                  style={{
                    maxWidth: "",
                    overflowX: "hidden",
                  }}
                >
                  {false && (
                    <div className="search-box">
                      <i className="uil uil-search"></i>
                      <input type="text" placeholder="Buscar prescripción..." />
                      <button>LIMPIAR</button>
                    </div>
                  )}
                  <Search />

                  <div className="presc-labels">
                    {/* <div>Dueño</div>
                    <div>Telefono</div>
                    <div>Paciente</div>
                    <div>Fecha</div> */}
                    {/* <div>Raza</div> */}
                    <div style={{margin:'10px'}}>
                       <div>{descargando()}</div>
                    </div>
                  </div>
                  
                  {localPrescription.map((result,index) => {
                    // console.log({result})
                    /* const prescription = result.item; */
                    /* console.log('resultado map', result) */
                    const prescription = result;
                    /* console.log('prescription.register');
                    console.log(prescription.register);
                    console.log(prescription.register.owner.telephone); */
                    return (
                      <div
                        key={`${prescription.id}-${index}`}
                        className="presc"
                        
                      >
                        <CardViewPrescriptions
                          owner={prescription.register.owner.name}
                          phone={prescription.register.owner.telephone}
                          patient={prescription.register.pet.name}
                          date={moment(prescription.creation.utc).format("YYYY-MM-DD")}
                          veterinary= {prescription.register.veterinary.name }
                          veterinarysurname= {prescription.register.veterinary.surname }
                          veterinarytelephone={prescription.register.veterinary.telephone }
                          veterinarylocation={prescription.register.veterinary.location}
                          email={prescription.register.veterinary.email}
                          presentation={prescription.register.consultation.presentation}
                          units={prescription.register.consultation.units}
                          diagnostic= {prescription.register.consultation.diagnostic}
                          onDownload={async () => {
                            setDownloadingPdf(true);
                            const result = await axios.get(
                              "api/prescription",
  
                              {
                                params: { _id: prescription._id },
                                responseType: "arraybuffer",
                              }
                            );
  /*                           console.log('RESULT', result)
   */                          const blob = new Blob([result.data], {
                              type: "application/pdf",
                            });
                            const a = document.createElement("a");
                            a.href = window.URL.createObjectURL(blob);
                            a.download = `${
                              prescription.register.consultation.units
                            }-${prescription.register.veterinary.name}-${
                              prescription.register.consultation.presentation
                            }-${moment(prescription.time).format(
                              "YYYY-MM-DD"
                            )}-VET.pdf`;
                            a.click();
                            setDownloadingPdf(false);
                          }}
                        >
                          <div >
                          <AiOutlineDownload />
                        </div>
                        </CardViewPrescriptions>
                        {/* <div>{prescription.register.owner.name}</div>
                        <div> {prescription.register.owner.telephone}</div>
                        <div> {prescription.register.pet.name}</div>

                        <div>
                          {moment(prescription.time).format("YYYY-MM-DD")}
                        </div> */}
                        {/* <div>{prescription.register.pet.breed}</div> */}
                        
                      </div>
                    );
                  })}
                  <div className="pagination">
                  <button onClick={()=>{getPrescriptionByPageLess()}} className="pagination-button prev-button">
                    <span className="arrow">&larr;</span>
                  </button>
                  <>Pagina {currentPage} de {currentPageSize}</>
                  <button onClick={()=>{getPrescriptionByPagePlus()}} className="pagination-button next-button">
                    <span className="arrow">&rarr;</span>
                  </button>
                </div>

                </div>
              ) : (
                <div>Aún no tienes prescripciones creadas</div>
              )}
              
              <br />
              <br />
            </div>
          </div>
        </section>
      </div>)
    );
  
  
}

/* 

<button onClick={() => {Swal.fire(
            'Modal Captura información Prescripción!',
            'Pronto podras probar esta funcionalidad!',
            'success'
        )}} classNameName="btn solid" id="sign-up-btn">
              Crear prescripción
            </button>
                    </main>

                </section>

*/

/* 
<button onClick={() => signOut()} classNameName="btn solid" id="sign-up-btn">
              Cerrar Sesión
            </button>
*/

// import { unstable_getServerSession } from "next-auth/next";
// import { authOptions } from "./api/auth/[...nextauth]";
import { findAssets,findAssetsPagination } from "lib/models/assets";
import { getToken } from "next-auth/jwt";
import formula from "components/formula";
export async function getServerSideProps({ req, res }) {
  // const session = await unstable_getServerSession(req, res, authOptions);
  // console.log("session SSP: ", session);
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  // console.log("Token", token);
  let userInfo = {};
  if (token) userInfo = await getUserInfo("users", token.email);
  // console.log("userInfo", userInfo);
  // const wss = wss new WebSocketServer({ port: 1234 });
  // const user = req.session.user;
  // wss.on('connection', function connection(ws) {
  //   ws.on('message', function message(data) {
  //     console.log('received: %s');
  //   });
  //   // ws.send('something');
  // });
  // console.log("req.lastLive", req.lastLive);
  // if (false && !token.user) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }
  const assets = {
    prescriptions: await findAssets("prescriptions", {
      // "creation.by": token ? (token.user._id || token.user.id) : {},
      "creation.by": token ? token.user._id || token.user.id : {},
    }),
    userInfo,
    prescriptionPagination: await findAssetsPagination("prescriptions",{
      "creation.by": token ? (token.user._id || token.user.id) : {},
     })
  };
  // console.log("userInfo", userInfo);
  return {
    props: {
      initialAssets: JSON.stringify(assets),
      // existInfo,
      // initialUser: req.session.user ? req.session.user : null,
    },
  };
}
/*
<button onClick={() => {Swal.fire(
            'Modal Captura información Prescripción!',
            'Pronto podras probar esta funcionalidad!',
            'success'
        )}} classNameName="btn solid" id="sign-up-btn">
              Crear prescripción
            </button>
                    </main>
                </section>
*/
/*
<button onClick={() => signOut()} classNameName="btn solid" id="sign-up-btn">
              Cerrar Sesión
            </button>
*/
// <pre>{JSON.stringify(prescription, null, 2)}</pre>
