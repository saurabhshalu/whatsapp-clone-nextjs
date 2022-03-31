import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import Avatar from "./Avatar";

import { useRecoilState } from "recoil";
import emailAtom from "../atom/emailAtom";
import imageAtom from "../atom/imageAtom";
import lastSeenAtom from "../atom/lastSeenAtom";

const ChatTile = ({ id, email }) => {
  const [user, setUser] = useState({});
  const router = useRouter();

  const [, setEmailState] = useRecoilState(emailAtom);
  const [, setImageState] = useRecoilState(imageAtom);
  const [, setLastSeenState] = useRecoilState(lastSeenAtom);

  useEffect(() => {
    const getData = async () => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        const data = querySnapshot.docs[0].data();
        setUser({
          email: data.email,
          id: id,
          photoURL: data.photoURL,
          lastSeen: data.lastSeen,
        });
      } else {
        setUser({
          email: email,
          id: id,
          photoURL: "",
          lastSeen: "",
        });
      }
    };

    getData();
  }, [id, email]);

  return (
    <div
      className="flex p-2 text-white hover:bg-[#0b1216] cursor-pointer items-center"
      onClick={() => {
        console.log(user);
        setEmailState(user.email);
        setImageState(user.photoURL);
        setLastSeenState(user.lastSeen);
        router.push(`/chat/${user.id}`);
      }}
    >
      <Avatar photoURL={user.photoURL} email={user.email} />
      <p className="truncate">{user.email}</p>
    </div>
  );
};

export default ChatTile;
