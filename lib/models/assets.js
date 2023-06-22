import { connectToDatabase } from "lib/mongodb";
export const findAssets = async (collection, query /* = {} */) => {
  const { db } = await connectToDatabase();
  // const search = { $regex: `${searchTerm}`, $options: "i" };

  const result =
    Object.keys(query).length !== 0
      ? await db
          .collection(collection)
          .find(query)
          .sort({ $natural: -1 })
          .toArray()
      : [];

  return result;
};

export const findAssetsPagination = async (collection, query, page = 1, pageSize = 5 /* = {} */) => {
 
  const { db } = await connectToDatabase();
  // const search = { $regex: `${searchTerm}`, $options: "i" };

  
  const totalCount = await db.collection(collection).countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);
  const skip = (page - 1) * pageSize;
  const cursor = db.collection(collection).find(query)
       .skip(skip)
       .sort({"creation.utc":-1})
       .limit(pageSize);

  const results = await cursor.toArray();
   console.log('results',results) 
  return {
    results,
    totalPages,
    currentPage: page,
    pageSize,
    totalCount,
  } 

}
export const getAllCollection = async (collection, query={}) => {
  const { db } = await connectToDatabase();
  const result = await db.collection(collection).aggregate([{$match:query}]).sort({"creation.utc":-1}).toArray();
  console.log('RESULT DET ALL COLLECTION ADMIN', result)
  return result;
};


export const findUser = async (collection, userId) => {
  const { db } = await connectToDatabase();
  const result = await db.collection(collection).findOne({ id: userId });
  return result;
};
export const getUserInfo = async (collection, email) => {
  const { db } = await connectToDatabase();
  const user = await db.collection(collection).findOne({ email });
  const userInfo = await user && user.info ? user.info : {};
  return await userInfo;

  
};
export const getUserByEmail = async (collection, email) => {
  const { db } = await connectToDatabase();
  const result = await db.collection(collection).findOne({ email });
  return result;
};

export const addUser = async (user, providerData) => {
  const { db } = await connectToDatabase();
  try {
    db.collection("users").insertOne({ ...user, providerData });
  } catch (error) {
    // Add a custom error responser here
  }
};

// .aggregate([
//   {
//     $match: {
//       $or: [{ id: search }, { ref: search }],
//     },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'creation.by',
//       foreignField: '_id',
//       as: 'creation.by',
//     },
//   },
//   { $unwind: '$creation.by' },
//   {
//     $project: { 'creation.by.log': 0 },
//   },
// ])
