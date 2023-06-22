// import BusinessError from "complements/exceptions/BusinessError";
import { getUserByEmail } from "lib/models/assets";
import { connectToDatabase } from "lib/mongodb";
import { getToken } from "next-auth/jwt";
import { getDate } from "./helpers/helpers";
import { ObjectId } from "mongodb";
export default async function ProfileApi(req, res) {
  const createdAt = getDate();
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  const { email } = token;
  const { body, method } = req;
  const { db } = await connectToDatabase();
  const result = await getUserByEmail("users", email);

  // Get method
  if (method.includes("GET")) {
    result
      ? res.status(200).json({ result })
      : res.status(200).json({ result: "No existe el usuario" });
  }
  // Post method
  else if (method.includes("POST")) {
    if (result)
      try {
        await db
          .collection("users")
          .updateOne({ email }, { $set: { info: { ...body, createdAt } } });
        res.status(200).json({ status: "ok" });
      } catch (error) {
        throw error;
        //   throw new BusinessError(error);
      }
  } 
   // Delete method
  else if (method.includes("DELETE")) {
    if (result)
      {
        try {
         await db.collection("users").deleteOne(token.user._id? {_id:ObjectId(token.user._id)}:{id: token.user.id});
        res.status(200).json({ status: "ok" });
      } catch (error) {
        throw error;
        //   throw new BusinessError(error);
      }}
  }
}
