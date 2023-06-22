import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Box from "./helpers/Box";
import Filter from "./helpers/Filter";
import PrescriptionList from "./helpers/PrescriptionList";
import { AiOutlineAccountBook } from "react-icons/ai";
import Paginator from "./helpers/PaginatorComponentV1";
import { useMain } from "vStore/main";
 const AdminPrescriptions = ({prescriptionPagination, setAdminPrescriptions, adminPrescriptions}) => {
  const {prescriptions}= useMain()
  const [downloadpdf, setDownloadingPdf] = useState(false);
  const [filterText, setFilter] = useState("");
  const {totalPages, results, currentPage, pageSize, totalCount}=JSON.parse(prescriptionPagination);
  const [localCurrentPage,  setCurrentPage]= useState(currentPage);
  const [localPrescriptions, setLocalPrescriptions] = useState([])
  useEffect(()=>{
    prescriptions.length? setLocalPrescriptions(prescriptions):""
  },[prescriptions])
  const api = "/api/prescriptionpaginator";
  console.log("CURRENTPAGE", prescriptionPagination)

  return <div style={{width:"100%", padding:"2%"}} >
    <Box numItem={totalCount} text={"prescripciones"} />
    <Filter filterText={filterText} onFilterChange={setFilter} ></Filter>
    <PrescriptionList filterText={filterText} items={filterText.length?results:adminPrescriptions} setDownloadingPdf={setDownloadingPdf} />
    <Paginator api={api} setCurrentPage={setCurrentPage}currentPage={localCurrentPage}pageSize={pageSize}totalPages={filterText.length?currentPage:totalPages} totalCount={totalCount}localPrescription={adminPrescriptions} setLocalPrescriptions={setAdminPrescriptions}  currentPageSize={adminPrescriptions.length} />
  </div>;
};


export default AdminPrescriptions;
