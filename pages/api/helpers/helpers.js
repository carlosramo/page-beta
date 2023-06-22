import { connectToDatabase } from "lib/mongodb";
import moment from "moment";
export const addIdPrescription = async (idPrescription, userId) => {};

export const totalUserPrescriptions = async (userId) => {
  const { db } = await connectToDatabase();
  const result = await db
    .collection("prescriptions")
    .find({ "creation.by": userId })
    .count()+1;

  return result;
};

export const findAssetsPagination = async (userId, query, page = 1, pageSize = 20 /* = {} */) => {
 
  const { db } = await connectToDatabase();
  // const search = { $regex: `${searchTerm}`, $options: "i" };

  const result =
    Object.keys(query).length !== 0
      ? await db
          .collection("prescription")
          .find({ "creation.by": userId })
      : [];

  const totalCount = await collection.countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);
  const skip = (page - 1) * pageSize;
  const cursor = result.find(filter)
      .skip(skip)
      .limit(pageSize);

  const results = await cursor.toArray();
  return {
    results,
    totalPages,
    currentPage: page,
    pageSize,
    totalCount,
  } 

}



export const getDate = (format) => format? moment().format(format): moment().format();
