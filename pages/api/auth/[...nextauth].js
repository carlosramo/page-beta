import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "lib/mongodb";
import { verifyPassword } from "lib/auth";
import { findUser } from "lib/models/assets";
import { NextResponse } from "next/server";

// import clientPromise from "lib/mongodb.ts";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
export default NextAuth({
  jwt: {
    secret: process.env.AUTH_SECRET,
  },
  session: {
    strategy: "jwt",
  },
  // adapter: MongoDBAdapter(connectToDatabase()),
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // console.log(process.env.AUTH_SECRET);
        const { db } = await connectToDatabase();
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
         console.log("user", user);
        if (!user) {
          // close();
          throw new Error("No user found!");
        } else {
          // console.log("aqui");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        // console.log("isValid", isValid);
        if (!isValid) {
          throw new Error("Could not log you in!");
        }
        // close();
        // return { _id: user._id.toString(), email: user.email };
        console.log('CredentialProvider FInish')
        console.log(user)
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("token", token);
      // console.log("USERTOKEN:", user);
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {

      // console.log("DATOS DE INICIO: ", token);
      // console.log("DATOS DE USUARIO: ", session);

      session.user = token.user;
      //  console.log("session session: ", session);
      return session;
    },
    // register: async ({ user, account, profile }) => {
    //   console.log("register");
    //   console.log({
    //     user,
    //     account,
    //     profile,
    //   });
    // Create a new user in your database using the profile object
    // Example:
    // const newUser = await User.create({
    //   email: profile.email,
    //   name: profile.name,
    //   googleId: profile.id
    // });

    // Store additional information about the user in the account object
    // Example:
    // account.email = profile.email;
    // account.password = 'password';

    // Save the user to the database
    // Example:
    // await account.save();

    // Sign the user in
    // Example:
    // return Promise.resolve(newUser);
    // },
    /* async redirect({ url, baseUrl }) {
      console.log('url',url,baseUrl)
      return `${baseUrl}/dashboard`;
    }, */
    signIn: async ({ user, account, profile }) => {

      // console.log("DATOS DE INICIO: ",user);
      const { id } = user;
      const exist = await findUser("users", id);
      // console.log("NO EXISTE", exist);
      if(account.provider.includes("google") && profile.email_verified && !exist){
        await addUser(user, account)
        return true
      }
      
      return Promise.resolve(user); 
    },
  },
  secret: process.env.JWT_SECRET,
});

const addUser = async (user, providerData) => {
  const { db } = await connectToDatabase();
  try {
    db.collection("users").insertOne({ ...user, providerData });
  } catch (error) {
    // Add a custom error responser here
  }
};
