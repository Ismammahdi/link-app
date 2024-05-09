import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

const MyGroup = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const [groupList, setGroupList] = useState([]);
  // const [showRequest, setShowRequest] = useState(false);
  const [groupJoinRequestList, setGroupJoinRequestList] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  // get my group start
  const groupRef = ref(db, "group");

  useEffect(() => {
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminId) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  // get group list end

  // group delete start
  const handleGroupDelete = (item) => {
    remove(ref(db, "group/" + item.key));
  };
  // group delete end

  // handle group request start
  const handleGroupRequest = (group) => {
    setShowRequest(!showRequest);

    const groupRequestRef = ref(db, "groupJoinRequest");
    onValue(groupRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          data.uid === item.val().adminId &&
          item.val().groupId === group.key
        ) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupJoinRequestList(list);
    });
    // console.log(groupJoinRequestList);
    // console.log(group);
  };
  // handle group request end

  // handle group request accept start
  const handleGroupRequestAccept = (item) => {
    set(push(ref(db, "groupMembers")), {
      groupId: item.groupId,
      groupName: item.groupName,
      adminId: item.adminId,
      adminName: item.adminName,
      userId: item.userId,
      userName: item.userName,
    }).then(() => {
      remove(ref(db, "groupJoinRequest/" + item.key));
    });
  };
  // handle group request accept end

  // group request reject start
  const handleGroupRequestReject = (item) => {
    remove(ref(db, "groupJoinRequest/" + item.key));
  };
  // group request reject start

  // handle group info starts
  const handleGroupInfo = (itemInfo) => {
    setShowGroupInfo(!showGroupInfo);

    const groupMemberRef = ref(db, "groupMembers");
    onValue(groupMemberRef, (snapshot) => {
      const list = [];
      snapshot.forEach((item) => {
        if (
          data.uid === itemInfo.adminId &&
          item.val().groupId === itemInfo.key
        ) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMembers(list);
    });
  };
  // handle group info ends

  return (
    <>
      <div className="">
        <div className="title flex justify-between items-center">
          <div className="text">
            <h1>My Group</h1>
          </div>
        </div>

        {groupList.length == 0 ? (
          <h1 className="text-center font-bold text-red-500 text-2xl uppercase">
            No group available
          </h1>
        ) : showRequest ? (
          <div className="bg-[#B0C5A4] py-10 px-5  rounded-lg relative overflow-hidden">
            <button
              onClick={() => setShowRequest(!showRequest)}
              className="button_v_5  absolute w-auto top-2 right-2 cursor-pointer"
            >
              Close
            </button>
            {groupJoinRequestList.map((item, i) => {
              return (
                <div
                  key={i}
                  className="flex justify-between items-center border-b-2 border-slate-300 bg-white p-6 mb-2 rounded-md "
                >
                  <div className="flex gap-4">
                    <div className="img w-[50px] h-[50px] bg-green-500 rounded-full flex justify-center items-center">
                      {/* <h1 className="font-bold uppercase text-primary">
                        {item.groupName[0]}
                      </h1> */}
                      <ProfilePicture imgId={item.userId} />
                    </div>

                    <div className="">
                      <h2 className="mt-[50%] translate-y-[-50%] font-bold  text-base capitalize">
                        {item.userName}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGroupRequestAccept(item)}
                      className="button_v_4 p-1"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleGroupRequestReject(item)}
                      className="button_v_3 p-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : showGroupInfo ? (
          <div className="bg-[#B0C5A4] py-10 px-5  rounded-lg relative overflow-hidden">
            <button
              onClick={() => setShowGroupInfo(!showGroupInfo)}
              className="button_v_5  absolute w-auto top-2 right-2 cursor-pointer"
            >
              Close
            </button>
            {groupMembers.map((item, i) => {
              return (
                <div
                  key={i}
                  className="flex justify-between items-center border-b-2 border-slate-300 bg-white p-6 mb-2 rounded-md "
                >
                  <div className="flex gap-4">
                    <div className="img w-[50px] h-[50px] bg-green-500 rounded-full flex justify-center items-center">
                      {/* <h1 className="font-bold uppercase text-primary">
                      {item.groupName[0]}
                    </h1> */}
                      <ProfilePicture imgId={item.userId} />
                    </div>

                    <div className="">
                      <h2 className="mt-[50%] translate-y-[-50%] font-bold  text-base capitalize">
                        {item.userName}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGroupRequestAccept(item)}
                      className="button_v_4 p-1"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleGroupRequestReject(item)}
                      className="button_v_3 p-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          groupList.map((item, i) => {
            return (
              <div
                key={i}
                className="flex justify-between items-center border-b-2 border-slate-300 mb-2"
              >
                <div className="flex gap-5">
                  <div className="img w-[50px] h-[50px] bg-green-500 rounded-full flex justify-center items-center">
                    <h1 className="font-bold uppercase text-primary">
                      {item.groupName[0]}
                    </h1>
                  </div>

                  <div className="">
                    <h1 className=" font-bold text-red-500 text-sm capitalize">
                      Admin: {item.adminName}
                    </h1>
                    <h1 className="font-bold text-lg text-primary">
                      {item.groupName}
                    </h1>
                    <p className="text-slate-600 text-sm ">{item.groupIntro}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleGroupInfo(item)}
                    className="button_v_4 p-1"
                  >
                    Info
                  </button>

                  <button
                    onClick={() => handleGroupRequest(item)}
                    className="button_v_3 p-1"
                  >
                    Request
                  </button>
                  <button
                    onClick={() => {
                      handleGroupDelete(item);
                    }}
                    className="button_v_5 p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default MyGroup;
