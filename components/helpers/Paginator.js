import { useEffect, useState } from "react";
import axios from "axios";
const Paginator = ({api, localPrescription, setLocalPrescriptions,  currentPageSize,currentPage,totalPages, setCurrentPage,}) => {
 
  
useEffect(()=>{
})
  useEffect(() => {
    console.log("---useEffect Local prescriptionlocal", localPrescription,'PAGE', currentPage);
    setLocalPrescriptions(localPrescription);
  }, [localPrescription, currentPage]);

  const nextPage = async () => {
    if (currentPage + 1 > currentPageSize) {
      return null;
    } else {
      setCurrentPage(currentPage + 1);
      const result = await axios.get(`${api}`, {
        params: {
          pageSize: currentPageSize,
          currentPage: currentPage + 1,
        },
      });
      console.log('RESULT + PAGE',result)
      console.log("paginator result PLus", result.data);
      setLocalPrescriptions(result.data.results);
    }
  };

  const previewPage = async () => {
    if (currentPage - 1 === 0) {
      return null;
    } else {
      setCurrentPage(currentPage - 1);
      const result = await axios.get(`${api}`, {
        params: {
          pageSize: currentPageSize,
          currentPage: currentPage - 1,
        },
      });
      console.log("paginator result Less", result.data.results);
      setLocalPrescriptions(result.data.results);
    }
  };
  return (
    <div className="pagination">
      <button
        onClick={() => {
          previewPage();
        }}
        className="pagination-button prev-button"
      >
        <span className="arrow">&larr;</span>
      </button>
      <>
        Pagina {currentPage} de {totalPages}
      </>
      <button
        onClick={() => {
          nextPage();
          console.log('CURRENTPAGE', currentPageSize/totalPages)
        }}
        disabled={localPrescription.length<5}
        className="pagination-button next-button"
      >
        <span className="arrow">&rarr;</span>
      </button>
    </div>
  );
};

export default Paginator;
