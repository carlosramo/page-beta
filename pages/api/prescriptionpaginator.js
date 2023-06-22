
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import { findAssetsPagination } from "lib/models/assets";

// const middlewarePaginator = async(user ,flag="")=>{
// if (user && user.role) {
  
//   }
// else if(user && user.role){
//   user.role ==='Admin' && {}
// }
// else{
//     ({"creation.by": user._id || user.id})

// }
// return
// }

export default async function prescriptionPaginator(req, res) {
   /*  const {
        params
      } = req.body; */
      console.log('req.body',req.query)
    if (req.method == "GET") {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await getToken({ req, secret });
        console.log('token backend', token)
      // const query = await middlewarePaginator(token.user, req.query.filter )
      const prescription = await findAssetsPagination("prescriptions",{
        "creation.by": token ? (token.user._id || token.user.id) : {}},req.query.currentPage,req.body.currentPageSize)
        // console.log('backend presciption by page',prescription)
        res.status(200).json(prescription);
  }
}



