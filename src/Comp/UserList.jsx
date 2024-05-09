import { useEffect, useState } from "react";

import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

const UserList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const [userList, setUserList] = useState([]);
  const [friendRequestList, setfriendRequestList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [searchUser, setSearchUser] = useState([]);

  // get userlist from users collection start\
  useEffect(() => {
    const useRef = ref(db, "users");
    onValue(useRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
        // console.log(item);
      });
      setUserList(list);
      console.log(userList);
    });
  }, []);

  // freind request send stert
  const handleFriendRequest = (item) => {
    set(push(ref(db, "friendRequest")), {
      senderId: data.uid,
      senderName: data.displayName,
      reciverId: item.id,
      reciverName: item.username,
    });
    console.log(item);
  };
  // freind request send end

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      const request = [];
      snapshot.forEach((item) => {
        request.push(item.val().reciverId + item.val().senderId);
      });
      setfriendRequestList(request);
      console.log(friendRequestList);
    });
  }, []);

  // // get userlist from users collection end

  useEffect(() => {
    const friendListRef = ref(db, "friend");
    onValue(friendListRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().reciverId + item.val().senderId);
      });
      setFriendList(list);
    });
  }, []);
  // friend list data from friend collection ends

  // search start
  const handleSearch = (e) => {
    let arr = [];
    userList.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
      }
    });
    setSearchUser(arr);
  };
  console.log(searchUser);
  // search end

  return (
    <>
      <div className="">
        <div className="title flex justify-between items-center">
          <div className="text">
            <h1>User List</h1>
          </div>

          <input
            onChange={handleSearch}
            type="search"
            placeholder="Search"
            className="border outline-none rounded-lg w-[50%]  shadow-lg shadow-gray-400  placeholder:text-gray-400 px-5 py-1 border-primary"
          />
        </div>
        {searchUser.length > 0
          ? searchUser.map((item, i) => {
              // console.log(item);
              return (
                <div
                  key={i}
                  className="flex justify-between items-center border-b-2 border-slate-300 mb-2"
                >
                  <div className="flex gap-5">
                    <div className="img w-[50px] h-[50px] bg-green-500 rounded-full">
                      {/* <img src="" alt="" /> */}
                      <ProfilePicture imgId={item?.id} />
                    </div>
                    <div className="">
                      <h1 className="font-semibold capitalize">
                        {item?.username}
                      </h1>
                      <p className="text-slate-600 text-sm ">{item?.email}</p>
                    </div>
                  </div>
                  <div>
                    {friendList.includes(data.uid + item?.id) ||
                    friendList.includes(item?.id + data.uid) ? (
                      <button className="button_v_3">Friend</button>
                    ) : friendRequestList.includes(item.id + data.uid) ||
                      friendRequestList.includes(data.uid + item.id) ? (
                      <button className="button_v_3">panding....</button>
                    ) : (
                      <button
                        onClick={() => handleFriendRequest(item)}
                        className="button_v_3"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          : userList.map((item, i) => {
              // console.log(item);
              return (
                <div
                  key={i}
                  className="flex justify-between items-center border-b-2 border-slate-300 mb-2"
                >
                  <div className="flex gap-5">
                    <div className="img w-[50px] h-[50px] bg-green-500 rounded-full">
                      {/* <img src="" alt="" /> */}
                      <ProfilePicture imgId={item.id} />
                    </div>
                    <div className="">
                      <h1 className="font-semibold capitalize">
                        {item.username}
                      </h1>
                      <p className="text-slate-600 text-sm ">{item.email}</p>
                    </div>
                  </div>
                  <div>
                    {friendList.includes(data.uid + item?.id) ||
                    friendList.includes(item.id + data.uid) ? (
                      <button className="button_v_3">Friend</button>
                    ) : friendRequestList.includes(item.id + data.uid) ||
                      friendRequestList.includes(data.uid + item.id) ? (
                      <button className="button_v_3">panding....</button>
                    ) : (
                      <button
                        onClick={() => handleFriendRequest(item)}
                        className="button_v_3"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
};

export default UserList;

// friendRequestList.includes(data.uid + item.id) || friendRequestList.includes(item.id + data.uid)
