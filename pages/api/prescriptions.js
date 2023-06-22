import { findAssetsPagination } from "lib/models/assets";
import { getToken } from "next-auth/jwt";

export default async function   prescriptions  (req, res)  {
    if (req.method == "GET") {
      const secret = process.env.NEXTAUTH_SECRET;
      const {user} = await getToken({ req, secret });
      const prescription = user.role && user.role.includes("Admin")?  await findAssetsPagination("prescriptions",{},
      req.query.currentPage,req.body.currentPageSize): {}
        res.status(200).json(prescription);
  }
  }
  