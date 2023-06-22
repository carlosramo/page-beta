import axios from "axios";
import CardViewPrescription from "components/cardViewPrescriptions";
import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { validateItem } from "./functionHelpers";

export default function PrescriptionListComponent({
  items,
  filterText,
  setDownloadingPdf,
}) {
  const session = useSession();
  const [user, setUser] = useState(session);

  useEffect(() => {
    if (session.status === "authenticated") {
      setUser(session.data.user);
    }
  }, [session]);

  const filteredItems = items.filter((item) => {
    const {
      register: { owner, pet, veterinary },
    } = item;
    return (
      veterinary.name.toLowerCase().includes(filterText) ||
      owner.name.toLowerCase().includes(filterText) ||
      owner.telephone.toLowerCase().includes(filterText) ||
      pet.name.toLowerCase().includes(filterText) ||
      item.creation.by.toLowerCase().includes(filterText)
    );
  });

  return (
    <>
      {filteredItems.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(a.creation.utc) - new Date(b.creation.utc);
}).map((prescription, index) => {
          console.log('ADMIN PRESCRIPTION')
          console.log({ prescription });
          return (
            <ul
              style={{ marginBottom: "2%" }}
              key={`${prescription.id}-${index}`}
            >
              <div
                className={
                  validateItem(prescription.creation.by, user)
                    ? "presc_admin"
                    : "presc"
                }
              >
                <CardViewPrescription
                  prescriptionStateBD={prescription.prescription.prescriptionState}
                  veterinary={prescription.register.veterinary.name}
                  veterinarysurname={prescription.register.veterinary.surname}
                  owner={prescription.register.owner.name}
                  patient={prescription.register.pet.name}
                  phone={prescription.register.owner.telephone}
                  date={moment(prescription.creation.utc).format("YYYY-MM-DD")}
                  role={session.data.user.role ? session.data.user.role : ""}
                  onDownload={async () => {
                    setDownloadingPdf(true);
                    const result = await axios.get("/api/prescription", {
                      params: { _id: prescription._id },
                      responseType: "arraybuffer",
                    });
                    const blob = new Blob([result.data], {
                      type: "application/pdf",
                    });
                    const a = document.createElement("a");
                    a.href = window.URL.createObjectURL(blob);
                    a.download = `${prescription.register.consultation.units}-${
                      prescription.register.veterinary.name
                    }-${
                      prescription.register.consultation.presentation
                    }-${moment(prescription.time).format(
                      "YYYY-MM-DD"
                    )}-VET.pdf`;
                    a.click();
                    setDownloadingPdf(false);
                  }}
                  idPrescription={prescription._id}
                />
                {console.log(session.data)}
              </div>
            </ul>
          );
        })
        .reverse()}
    </>
  );
}
