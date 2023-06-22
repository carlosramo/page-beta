import Profile from "components/Profile";
import { getToken } from "next-auth/jwt";
import { getUserInfo } from "lib/models/assets";
import { setUserInfo } from "vStore/main";
import { useEffect } from "react";
export default function ProfileV2  ({ userData })  {
  useEffect(()=>{
    setUserInfo(userData)
  },[])
  return <Profile  />;
};



export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  let userData = {};
  if (token) userData = await getUserInfo("users", 
token.email
);
// console.log('userInfo Profile Backend', userData)
  return {
    props: {
      userData,
    },
  };
}; 