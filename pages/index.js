import Head from "next/head";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

const Home = () => {
  return (
    <>
      <Head>
        <title>WhatsApp Clone [select the chat to continue]</title>
      </Head>
      <div className="bg-[#222e35] border-l border-[#32424b] flex-1 min-w-[600px] flex flex-col">
        <div className="h-full flex flex-col justify-center items-center">
          <h1 className="text-gray-100 text-5xl flex justify-center items-center mb-5">
            WhatsApp Web
            <span className="bg-[#364147] px-5 py-2 rounded-full text-sm ml-4">
              NEW
            </span>
          </h1>
          <p className="text-gray-400">
            Now send and receive messages without keeping your phone online.
          </p>
          <p className="text-gray-400">
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
      </div>
    </>
  );
};

export default Home;
