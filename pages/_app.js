import "../styles/globals.css";
/* import "https://unicons.iconscout.com/release/v4.0.0/css/line.css"
 */
import { SessionProvider } from "next-auth/react";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
