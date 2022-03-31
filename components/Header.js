import { UserCircleIcon } from "@heroicons/react/solid";
import {
  FilmIcon,
  AnnotationIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
const Header = ({ users }) => {
  const router = useRouter();

  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNewEmail("");
    setError(null);
  }, [open]);

  const logoutHandler = async () => {
    try {
      await auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewChat = async () => {
    setError(null);
    try {
      if (
        newEmail &&
        newEmail !== auth.currentUser.email &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmail) &&
        newEmail.endsWith("@gmail.com")
      ) {
        if (users.findIndex((user) => user.email === newEmail) >= 0) {
          setError("Chat already exist.");
          return;
        }
        await addDoc(collection(db, "chats"), {
          users: [auth.currentUser.email, newEmail],
          timestamp: serverTimestamp(),
        });
        setOpen(false);
      } else {
        setError("Not a valid email");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong, please try later.");
    }
  };

  return (
    <>
      {open && (
        <div className="absolute h-full w-screen xl:h-[calc(100vh-2.5rem)] xl:w-[calc(100vw-5rem)] backdrop-blur-sm z-10 flex justify-center items-center">
          <div className="w-[320px] bg-white rounded-lg flex flex-col justify-center items-center px-10 py-6">
            <input
              autoFocus
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError(null);
              }}
              type="email"
              placeholder="Enter email address"
              className="w-full px-5 py-2 border-2 border-black rounded-md"
            />
            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleNewChat}
                className="bg-green-500 px-4 py-2 w-20 rounded-lg text-black font-bold hover:bg-green-600"
              >
                Start
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-red-500 px-4 py-2 w-20 rounded-lg text-white font-bold hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#202c33] h-16 flex items-center justify-between px-2">
        {auth.currentUser && auth.currentUser.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={auth.currentUser.photoURL}
            alt="user"
            className="h-12 rounded-full cursor-pointer"
            //onClick={logoutHandler}
          />
        ) : (
          <UserCircleIcon
            className="text-white h-12 cursor-pointer"
            //onClick={logoutHandler}
          />
        )}
        <div className="flex h-full space-x-4 items-center relative">
          <FilmIcon className="h-7 text-[#aebac1] mr-2" />
          <AnnotationIcon
            className="h-7 text-[#aebac1] cursor-pointer"
            onClick={() => {
              setOpen(true);
            }}
          />
          <div className="group">
            <DotsVerticalIcon className="h-7 text-[#aebac1]" />
            <div className="hidden group-hover:inline-block absolute -bottom-10 right-0 z-10 bg-slate-100 w-40 rounded-lg p-4 transition duration-150">
              <ul>
                <li
                  onClick={logoutHandler}
                  className="cursor-pointer font-bold"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
