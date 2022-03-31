import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
const Login = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false);
      } else {
        router.replace("/");
      }
    });
  }, [router]);

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#0a1014] flex h-screen xl:px-10 xl:py-5 items-center justify-center flex-col">
      <Head>
        <title>Whatsapp Clone (Login)</title>
      </Head>
      <h1 className="text-gray-100 text-5xl flex justify-center items-center mb-5">
        WhatsApp Web
      </h1>
      <p className="text-gray-400 mb-10">
        Now send and receive messages without keeping your phone online.
      </p>
      {!loading ? (
        <button
          onClick={handleLoginWithGoogle}
          className="bg-green-500 px-10 py-4 rounded-xl text-xl hover:bg-green-400 transition-all duration-100"
        >
          Sign In With Google
        </button>
      ) : (
        <LoadingSpinner />
      )}
      <p className="text-gray-400 mt-10">
        This app is developed by{" "}
        <span
          onClick={() => {
            window.open("https://github.com/saurabhshalu", "__blank");
          }}
          className="text-gray-200 italic font-bold cursor-pointer hover:text-white"
        >
          Saurabh Verma
        </span>
      </p>
    </div>
  );
};

export default Login;
