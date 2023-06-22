import { connectToDatabase } from "../../../lib/mongodb";
import { hash } from "bcryptjs";

async function handler(req, res) {
  if (req.method === "PUT") {
    const { password, email } = req.body;
    try {
      const { db } = await connectToDatabase();
      const status = await db.collection("users").updateOne(
        {
          email,
        },
        { $set: { password: await hash(password, 12) } }
      );
      return res
        .status(200)
        .json({ message: "Password updated", status: 200, ...status });
    } catch (error) {
      console.log({ error });
      throw error
      return res.status(500).json({ message: "failed reqest", error });
    }
  }
}

export default handler;
