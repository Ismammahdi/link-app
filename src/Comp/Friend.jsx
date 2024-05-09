import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
// import { Buttons_v_3, Buttons_v_4 } from "./Buttons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";
import { activeChat } from "../slice/activeChatSlice";

const FriendList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const dispatch = useDispatch();

  let [friend, setFriend] = useState([]);

  useEffect(() => {
    const friendRef = ref(db, "friend");
    onValue(friendRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          data.uid === item.val().reciverId ||
          data.uid === item.val().senderId
        ) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setFriend(list);
    });
  }, []);

  // Block start
  const handleBlock = (item) => {
    if (data.uid === item.senderId) {
      set(push(ref(db, "block")), {
        block: item.reciverName,
        blockId: item.reciverId,
        blockBy: item.senderName,
        blockById: item.senderId,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.senderName,
        blockId: item.senderId,
        blockBy: item.reciverName,
        blockById: item.reciverId,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    }
  };
  // Block end

  // Friend to unfriend start
  const handleUnfriend = (item) => {
    remove(ref(db, "friend/" + item.key));
  };
  // Friend to unfriend end

  // Active friend start
  const handleActiveFriend = (item) => {
    if (data.uid === item.reciverId) {
      dispatch(
        activeChat({
          status: "single",
          id: item.senderId,
          name: item.senderName,
        })
      );
      localStorage.setItem(
        "activeFriend",
        JSON.stringify({
          status: "single",
          id: item.senderId,
          name: item.senderName,
        })
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.reciverId,
          name: item.reciverName,
        })
      );
      localStorage.setItem(
        "activeFriend",
        JSON.stringify({
          status: "single",
          id: item.reciverId,
          name: item.reciverName,
        })
      );
    }
  };
  // active friend end

  return (
    <>
      <div className="">
        <div className="title flex justify-between items-center">
          <div className="text flex gap-10  justify-between z-10 w-full py-5 bg-white left-0 top-0 sticky">
            <h1 className="text-xl font-semibold font-Poppins">Friends</h1>
            <input type="text" />
          </div>
        </div>

        {friend.map((item, i) => {
          return (
            <div
              onClick={() => handleActiveFriend(item)}
              key={i}
              className="cursor-pointer flex justify-between items-center border-b-2 border-slate-300 mb-2"
            >
              <div className="flex gap-5">
                <div className="img w-[50px] h-[50px] bg-green-500 rounded-full">
                  <ProfilePicture
                    imgId={
                      data.uid === item.senderId
                        ? item.reciverId
                        : item.senderId
                    }
                  />
                </div>
                <div className="">
                  {data.uid === item.senderId ? (
                    <h1 className="font-semibold">{item.reciverName}</h1>
                  ) : (
                    <h1 className="font-semibold">{item.senderName}</h1>
                  )}

                  <h2>hy...</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUnfriend(item)}
                  className="button_v_3"
                >
                  Unfriend
                </button>
                <button
                  onClick={() => handleBlock(item)}
                  className="button_v_4"
                >
                  Block
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FriendList;
