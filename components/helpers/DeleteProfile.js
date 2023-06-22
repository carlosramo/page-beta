import axios from "axios";
import styles from "./_delete.module.scss";
import { swaltConfirm } from "./swaltHelpers";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
 const DeleteProfile = ({
  text = "Darme de baja",
  type = "button",
  urlApi,
  options,
}) => {
  const router = useRouter();
  const handleRequest = async () => {
    swaltConfirm().then((resp) =>
      resp.value
        ? axios
            .delete(urlApi, { data: options })
            .then(
              ({ data: { status } }) =>
                status.includes("ok")
                  ? toast.success("Usuario eliminado, redirigiendo...", {
                      position: toast.POSITION.TOP_CENTER,
                    })
                  : toast.error("No se pudo eliminar"),
              { position: toast.POSITION.TOP_CENTER }
            )
            .finally(signOut({callbackUrl:`https://app.klean-vet.com`}))
        : ""
    );
  };

  return (
    <button className={styles.link} style={{color:'orange'}} type={type} onClick={handleRequest}>
      {text}
    </button>
  );
};

export default DeleteProfile;

