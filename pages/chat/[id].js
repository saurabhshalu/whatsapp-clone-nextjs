import { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  onSnapshot,
  serverTimestamp,
  query,
  collection,
  where,
  getDoc,
} from "firebase/firestore";
import {
  DotsVerticalIcon,
  SearchIcon,
  EmojiHappyIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import Avatar from "../../components/Avatar";
import { auth, db } from "../../firebase";

import { useRecoilValue } from "recoil";
import emailAtom from "../../atom/emailAtom";
import imageAtom from "../../atom/imageAtom";
import lastSeenAtom from "../../atom/lastSeenAtom";

import ReactTimeAgo from "react-time-ago";

const ChatPage = ({ id, fetchedMessage }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(fetchedMessage || []);
  const [user, setUser] = useState({});

  const lastRef = useRef();

  const emailState = useRecoilValue(emailAtom);
  const imageState = useRecoilValue(imageAtom);
  const lastSeenState = useRecoilValue(lastSeenAtom);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      updateDoc(doc(db, "chats", id), {
        messages: arrayUnion({
          by: auth.currentUser.email,
          msg: message,
          timestamp: Timestamp.now(),
        }),
      });
      setMessage("");
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        lastSeen: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    lastRef.current.scrollIntoView({
      // behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", id), (docSnapshot) => {
      if (docSnapshot.data().messages) {
        setMessages(
          docSnapshot.data().messages.map((item, index) => ({
            ...item,
            timestamp: item.timestamp.toDate(),
            id: index,
          }))
        );
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsub();
    };
  }, [id]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("email", "==", emailState));
    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        let data = querySnapshot.docs[0].data();
        setUser({
          photoURL: data.photoURL,
          lastSeen: data.lastSeen,
        });
      }
    });
    return () => {
      unsub();
      setUser({});
      setMessages([]);
      setMessage("");
    };
  }, [id, emailState]);

  return (
    <>
      <Head>
        <title>WhatsApp Clone (Chat with {emailState})</title>
      </Head>
      <div className="bg-[#222e35] border-l border-[#32424b] flex-1 min-w-[600px] flex flex-col">
        <div className="bg-[#202c33] h-16 py-2 flex items-center justify-between px-6 sticky">
          <div className="flex items-center space-x-4">
            <Avatar email={emailState} photoURL={user.photoURL || imageState} />
            <div>
              <p className="text-gray-100 font-bold">{emailState}</p>
              <p className="text-gray-300 text-xs">
                Last Seen:{" "}
                {user.lastSeen || lastSeenState ? (
                  <ReactTimeAgo
                    date={
                      user.lastSeen
                        ? user.lastSeen.toDate()
                        : lastSeenState.toDate()
                    }
                    locale="en"
                  />
                ) : (
                  "unknown"
                )}
              </p>
            </div>
          </div>
          <div className="flex h-full space-x-4 items-center">
            <SearchIcon className="h-7 text-[#aebac1]" />
            <DotsVerticalIcon className="h-7 text-[#aebac1]" />
          </div>
        </div>
        <div className="h-full bg-[#0b141a] relative scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent overflow-y-scroll">
          {messages.map((item) => {
            return (
              <div
                key={item.id}
                className={`my-4 flex items-center ${
                  item.by === auth.currentUser.email && "justify-end"
                }`}
              >
                <div
                  className={`${
                    item.by === auth.currentUser.email
                      ? "bg-[#005c4b] pl-8 rounded-tr-xl mr-4 rounded-l-md"
                      : "bg-[#202c33] pr-8 rounded-tl-xl ml-4 rounded-r-md"
                  } px-4 py-2 relative max-w-sm break-words`}
                >
                  <p
                    className={`${
                      item.by === auth.currentUser.email
                        ? "text-right"
                        : "text-left"
                    } text-white py-3 min-w-[75px]`}
                  >
                    {item.msg}
                  </p>
                  <span
                    className={`absolute bottom-[2px] text-[12px] text-gray-400 min-w-fit whitespace-nowrap ${
                      item.by === auth.currentUser.email
                        ? "left-1  ml-1"
                        : "right-1  mr-1"
                    }`}
                  >
                    {item.timestamp
                      .toLocaleString()
                      .replace(`${new Date().toLocaleDateString()}, `, "")
                      .slice(0, -3)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={lastRef} className="h-5"></div>
        </div>
        <div className="bg-[#202c33] h-20 flex items-center justify-between px-6 space-x-6 sticky">
          <div className="flex space-x-4">
            <EmojiHappyIcon className="h-8 text-[#aebac1]" />
            <PaperClipIcon className="h-8 text-[#aebac1]" />
          </div>
          <form className="w-full" onSubmit={sendMessage}>
            <input
              autoFocus
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setMessage(e.target.value);
                }
              }}
              type="text"
              placeholder="Type a message (max 500 characters)"
              className="pl-4 pr-4 py-3 focus:outline-none rounded-lg w-full bg-[#2a3942] text-white"
            />
          </form>
          {message ? (
            <PaperAirplaneIcon
              onClick={sendMessage}
              className="h-8 text-[#aebac1] rotate-90 cursor-pointer hover:text-[#798389]"
            />
          ) : (
            <MicrophoneIcon className="h-8 text-[#aebac1]" />
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  // const docRef = doc(db, "chats", context.query.id);
  // const docSnap = await getDoc(docRef);
  // let messages = [];

  // if (docSnap.exists() && docSnap.data().messages) {
  //   messages = docSnap.data().messages.map((item, index) => ({
  //     ...item,
  //     timestamp: item.timestamp.toDate().toString(),
  //     id: index,
  //   }));
  // }
  return {
    props: {
      id: context.query.id,
      //fetchedMessage: messages,
    },
  };
};

export default ChatPage;
