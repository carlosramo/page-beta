import Image from "next/image";
import Profileimg from "../public/img/Profile.svg";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import {
  AiFillCloseCircle,
  AiOutlineFileSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { useRouter } from "next/router";
export default function NAV ({ role = "Admin" }) {
  const router = useRouter();
  const handleClick = (e) => {
    return e.preventDefault();
  };
  return (
    <div  style={{ height:"100vh", width: "18%", position: "stycky" }}>
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
            <Link href={"/admin-dashboard/prescriptions"} >
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
    </div>
  );
};
