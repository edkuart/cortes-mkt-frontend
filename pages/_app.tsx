// 📁 pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MensajesProvider } from "@/context/MensajesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <MensajesProvider>
        <Component {...pageProps} />
      </MensajesProvider>
    </GoogleOAuthProvider>
  );
}
