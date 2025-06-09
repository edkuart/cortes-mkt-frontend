// 📁 pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MensajesProvider } from "@/context/MensajesContext";
import { API_BASE_URL } from "@/utils/api";
console.log("API_BASE_URL:", API_BASE_URL);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider> {/* ✅ aquí envolvemos */}
      <MensajesProvider>
        <Component {...pageProps} />
      </MensajesProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
