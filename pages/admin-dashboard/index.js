import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Router, { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import profile from "../../public/img/Profile.svg";
import wprofile from "../../public/img/girl.png";
import PetForm from "../../src/database/petform";
import BarLoader from "react-spinners/BarLoader";
import logo from "../../public/img/logo_kleanvet_Mesa de trabajo 1.svg";
import { FaHeart, FaRegHeart, FaHome } from "react-icons/fa";
import { AwesomeButton } from "react-awesome-button";
import {
  AiFillCloseCircle,
  AiOutlineUser,
  AiOutlineDownload,
  AiOutlineLeft,
  AiOutlineFileSearch,
} from "react-icons/ai";
import styleButton from "../../styles/Button.module.scss";
import "react-awesome-button/dist/styles.css";
import Modal from "../../src/database/components/modal";
import Profileimg from "../../public/img/Profile.svg";
import moment from "moment";
// const Formula = dynamic(() => import("../components/formula"), { ssr: false });
import Formula from "components/formula";
import Search from "components/Search";
import axios from "axios";
import { useMain, setPrescriptions, setUsers } from "vStore/main";
import Perfil from "components/Profile";
import { watch } from "valtio/utils";
import { ToastContainer } from "react-toastify";
import { swaltMiddleware, welcomeAlert } from "components/helpers/swaltHelpers";
import Filter from "../../components/helpers/Filter";

export default function AdminDashboard({ initialAssets }) {
  const router = useRouter();
  const formula = useRef();
  let { prescriptions, searchResult } = useMain();
  const buttonStates = {
    Prescripciones: JSON.parse(initialAssets).prescriptions.length,
    Revisadas: 0,
    "Usuarios ": JSON.parse(initialAssets).users.length,
  };
  const [localPrescription, setLocalPrescriptions] = useState(
    JSON.parse(initialAssets).prescriptionPagination.results
  );
  const [currentPage, setCurrentPage] = useState(
    JSON.parse(initialAssets).prescriptionPagination.currentPage
  );
  const [currentPageSize, setCurrentPageSize] = useState(
    JSON.parse(initialAssets).prescriptionPagination.totalPages
  );
  const [renderState, setRenderState] = useState(Object.entries(buttonStates));
  const [downloadpdf, setDownloadingPdf] = useState(false);
  const { status, data } = useSession();
  const { role } = data ? data.user : "";
  const [userData, setUserData] = useState(null);
  const [filterText, setFilter] = useState("");
  const [tempInitialAssets] = useState({
    prescriptions: JSON.parse(initialAssets).prescriptionPagination.results,
    totalPages: JSON.parse(initialAssets).prescriptionPagination.totalPages,
    currentPage: JSON.parse(initialAssets).prescriptionPagination.currentPage
  })
const url ="api/prescriptions"
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status]);

  useEffect(() => {
    setPrescriptions(JSON.parse(initialAssets).prescriptions);
    setUserData(JSON.parse(initialAssets).userInfo);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      const resp = async () => {
        (await validateUserInfo())
          ? ""
          : welcomeAlert().then((e) => e.value && router.replace("/profile"));
      };
      resp();
    } else {
      <BarLoader color="#36d7b7" />;
    }
  }, [status]);

  const validateUserInfo = async () => {
    try {
      const response = await axios
        .get("/api/profile")
        .then(({ data }) => data.result)
        .then((result) => {
          setUserData(() => result.info);
          return !!result.info;
        });
      return response;
    } catch (error) {
      console.log("ERROR", error);
    }
  };
const validateItem = (id) =>{
  let resp = null; 
  
  if(data.user._id || data.user.id ){
    resp =id.localeCompare(data.user._id || data.user.id ) ===0
  }
return resp
}

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

  if (status === "authenticated") {
    return (
      <div>
        <ToastContainer />
        <Formula
          ref={formula}
          onCreated={(newPresc) => {
            setPrescriptions([...prescriptions, newPresc]);
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
            </div>

            <span className="logo_name">{role}</span>
          </div>

          <div className="menu-items">
            <ul className="nav-links">
              <li>
                <Link href="/admin-dashboard">
                  <i className="uil uil-estate">
                    <FaHome />
                  </i>
                  <span className="link-name">Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <i className="uil uil-files-landscapes">
                    <AiOutlineUser />
                  </i>
                  <span className="link-name">Perfil</span>
                </Link>
              </li>
              <li>
                <Link href={"/admin-dashboard/prescriptions"}>
                  <i className="uil uil-files-landscapes">
                    <AiOutlineFileSearch />
                  </i>
                  <span className="link-name">Mis prescripciones</span>
                </Link>
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
                        /* callbackUrl: `https://klean-vet.herokuapp.com`, */
                        /* `http://localhost:3000/dashboard` */
                /*  `https://klean-vet.herokuapp.com/dashboard` */
                /* `http://localhost:3000/dashboard` */
                // callbackUrl: `https://klean-vet.herokuapp.com/dashboard`,
                /* https://kleanvet-testing.herokuapp.com/ */
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
                {renderState.map(([key, value], ind) => (
                  <div className={`box box${ind}`} key={`${key}-${ind}`} 
                  onClick={()=>{
                    console.log('Click')
                    console.log(key)
                    if(key.includes("Usuarios")){
                      console.log('aqui')
                      router.push(`https://app.klean-vet.com/admin-dashboard/admin-users`)
                    }
                  }}
                  >
                    {/* <i className="uil uil-comments"></i> */}
                    <span className="text">{key}</span>
                    <span className="number">{value}</span>
                  </div>
                ))}
              </div>
              <br />
              {/* <AwesomeButton classNameName={styleButton.awsbtn} >Registrar Prescripción</AwesomeButton> */}
            </div>

            <div className="activity">
              <div style={{ display: "flex" }} className="buttons_prescription">
               
                <AwesomeButton
                  classNameName={styleButton.awsbtn}
                  onPress={async () =>
                    (await validateUserInfo())
                      ? formula.current.open()
                      : swaltMiddleware().then((res) =>
                          res.value ? router.replace("/profile") : ""
                        )
                  }
                >
                  Registrar Prescripción
                </AwesomeButton>
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
                  {/* <Search /> */}
                  {
                    <Filter
                      filterText={filterText}
                      onFilterChange={setFilter}
                    />
                  }
                  <div style={{margin:'10px'}}>
                       <div>{descargando()}</div>
                    </div>
                  {
                    <PrescriptionsList
                      items={ filterText.length? prescriptions: localPrescription}
                      filterText={filterText}
                      setDownloadingPdf={setDownloadingPdf}
                    />
                  }
                  {
                    <Paginator
                      setLocalPrescriptions={setLocalPrescriptions}
                      setCurrentPage={setCurrentPage}
                      localPrescription={localPrescription}
                      currentPage={currentPage}
                      currentPageSize={currentPageSize}
                      flagFilter={filterText}
                      totalPages={currentPageSize}
                      api={url}
                    />
                  }
                </div>
              ) : (
                <div>Aún no tienes prescripciones creadas</div>
              )}

              <br />
              <br />
            </div>
          </div>
        </section>
      </div>
    );
  }
  return (
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
import {  findAssetsPagination, getAllCollection } from "lib/models/assets";
import { getToken } from "next-auth/jwt";
import { subscribe } from "valtio";
import PrescriptionsList from "components/helpers/PrescriptionList";
import Paginator from "components/helpers/Paginator";
export async function getServerSideProps({ req, res }) {
  console.log('PETICION', req.query)
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const assets = {
    prescriptions: await getAllCollection("prescriptions", {}),
    users: await getAllCollection("users", {}),
    prescriptionPagination: await findAssetsPagination("prescriptions", {},),
  };

  // console.log("ASSETS", assets.prescriptionPagination);

  return {
    props: {
      initialAssets: JSON.stringify(assets),
    },
  };
}
