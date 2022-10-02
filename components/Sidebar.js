import { useEffect, useState } from "react";
import Header from "./Header";
import { SearchIcon } from "@heroicons/react/outline";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ChatTile from "./ChatTile";
const Sidebar = () => {
  const [users, setUsers] = useState([]);

  const [input, setInput] = useState("");

  const handleSearchChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", auth.currentUser.email)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const userList = querySnapshot.docs.map((item) => ({
        email: item
          .data()
          .users.filter((user) => user !== auth.currentUser.email)[0],
        id: item.id,
        timestamp: item.data().timestamp?.toDate(),
      }));
      userList.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setUsers(userList);
    });
    return () => {
      unsub();
    };
  }, []);

  const filteredUser = users.filter((user) => user.email.includes(input));
  return (
    <div className="bg-[#111b21] flex-1 max-w-sm w-full min-w-[300px]">
      <Header users={users} />
      <div className="relative px-3 py-2 border-b border-[#202c33]">
        <SearchIcon className="h-5 absolute text-[#8696a0] mt-[10px] ml-2" />
        <input
          value={input}
          onChange={handleSearchChange}
          className="pl-14 pr-4 py-2 focus:outline-none rounded-lg w-full bg-[#202c33] text-white"
          type="text"
          placeholder="Search or start new chat"
        />
      </div>
      <div>
        {filteredUser.map((user) => (
          <ChatTile id={user.id} key={user.id} email={user.email} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
