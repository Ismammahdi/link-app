import { useSelector } from "react-redux";
// import { Buttons_v_3, Buttons_v_4 } from "./Buttons";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";

const FriendRequest = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [friendRequestList, setFriendRequestList] = useState([]);

  // friend request list from friendrequest collection starts

  useEffect(() => {
    const frindRequestRef = ref(db, "friendRequest");

    onValue(frindRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        // console.log(item.val());

        if (item.val().reciverId === data.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequestList(list);
    });
  }, []);

  // friend request list from friendrequest collection ends

  // fiend request accept start
  const handleFriendRequestAccept = (item) => {
    // console.log(item);
    set(push(ref(db, "friend")), {
      ...item,
    }).then(() => {
      // console.log("success");
      remove(ref(db, "friendRequest/" + item.id));
    });
  };

  const handleFriendDelete = (item) => {
    // console.log(item);

    remove(ref(db, "friendRequest/" + item.id));
  };
  // fiend request accept end

  return (
    <>
      <div className="">
        <div className="title flex justify-between items-center">
          <div className="text">
            <h1>Friend Request</h1>
          </div>
        </div>
        {friendRequestList.map((item) => {
          return (
            <div
              key={item.id}
              className="flex justify-between items-center border-b-2 border-slate-300 mb-2"
            >
              <div className="flex gap-5">
                <div className="img w-[50px] h-[50px] bg-green-500 rounded-full">
                  <ProfilePicture imgId={item.senderId} />
                </div>
                <div className="">
                  <h1 className="font-semibold mt-2.5">{item.senderName}</h1>
                  {/* <p className="text-slate-600 text-sm ">ismam@gmail.com</p> */}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleFriendRequestAccept(item);
                  }}
                  className="button_v_3 font-semibold"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleFriendDelete(item)}
                  className="button_v_4 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FriendRequest;
