import { mongoId, ObjectId } from "mongodb";
import { connectToDatabase } from "lib/mongodb";

const validatePayment = async (req, res) => {
  const { db } = await connectToDatabase();
  const {
    body: { prescriptionState, _id },
  } = req;
  console.log("llego", req.body);
  let result = null;
  if (req.method === "POST") {
    try {
      result = await db
        .collection("prescriptions")
        .updateOne(
          { _id: ObjectId(_id) },
          { $set: { "prescription.prescriptionState": prescriptionState } }
        );
      return res.status(200).json({ status: "ok", prescriptionState });
    } catch (error) {
      return error;
    }
  }
  return result;
};
export default validatePayment;
