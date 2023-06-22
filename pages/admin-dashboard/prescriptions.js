import AdminPrescription from "components/AdminPrescription";
import Nav from "components/Nav";
// import  { useRouter } from "next/router";

export default function AdminPrescriptions({
  prescriptionPagination,
  prescriptions,
}) {
  // const router = useRouter();
  const api = "/api/prescriptions";

  console.log("PAGINATION", JSON.parse(prescriptionPagination));
  // console.log('PRESCRIPTION PARAMS', prescriptions)

  const [adminPrescriptions, setAdminPrescriptions] = useState(
    JSON.parse(prescriptions)
  );

  return (
    <div style={{ display: "flex" }}>
      <Nav />
      <AdminPrescription
        setAdminPrescriptions={setAdminPrescriptions}
        adminPrescriptions={adminPrescriptions}
        prescriptionPagination={prescriptionPagination}
      />
    </div>
  );
}

import { getToken } from "next-auth/jwt";
import { findAssetsPagination, getAllCollection } from "lib/models/assets";
import { useState } from "react";
export async function getServerSideProps({ req, res }) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const query = token ? { "creation.by": token.user._id } : {};
  const adminPrescriptions = await getAllCollection("prescriptions", query);
  const adminPagination = await findAssetsPagination("prescriptions", query);
  // console.log('ASSETS PAGINATION', adminPagination)
  // console.log('PRESCRIPCIONES-RES', adminPrescriptions && adminPrescriptions)

  return {
    props: {
      prescriptionPagination: JSON.stringify(adminPagination),
      prescriptions: JSON.stringify(adminPrescriptions),
    },
  };
}
