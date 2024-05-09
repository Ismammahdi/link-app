import { useState, useEffect } from "react";
import { ref, onValue, push, set, getDatabase } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const [show, setShow] = useState(false);

  // get input value
  const [groupName, setGroupName] = useState("");
  const [groupIntro, setGroupIntro] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [groupIntroError, setGroupIntroError] = useState("");
  let [groupList, setGroupList] = useState([]);

  console.log(groupList);

  // creategroup start
  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setGroupNameError(""); // Clear any previous error when user starts typing
  };

  const handleGroupIntroName = (e) => {
    setGroupIntro(e.target.value);
    setGroupIntroError(""); // Clear any previous error when user starts typing
  };

  const handleClickGroup = () => {
    if (groupName === "") {
      setGroupNameError("Group name is required");
    } else if (groupIntro === "") {
      setGroupIntroError("Group intro is required");
    } else {
      set(push(ref(db, "group")), {
        groupName: groupName,
        groupIntro: groupIntro,
        adminName: data.displayName,
        adminId: data.uid,
      }).then(() => {
        alert("Group created");
        setShow(false);
        setGroupName("");
        setGroupIntro("");
      });
    }
  };

  // get my group list end
  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.val().adminId) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  // get my group list end

  // handle join group start

  const handleJoinGroup = (item) => {
    set(push(ref(db, "groupJoinRequest")), {
      groupId: item.id,
      groupName: item.groupName,
      adminId: item.adminId,
      adminName: item.adminName,
      groupIntro: item.groupIntro,
      userId: data.uid,
      userName: data.displayName,
    }).then(() => {
      alert("Request send");
    });
  };
  // handle join group end

  return (
    <>
      <div className="mb-4 relative">
        <div className="title sticky left-0 right-0">
          <h2 className="py-2 font-semibold text-xl">Group List</h2>

          <button
            onClick={() => {
              setShow(!show);
            }}
            className="button_v_3 w-auto"
          >
            {show ? "Cancel" : "Create Group"}
          </button>
        </div>

        {show ? (
          <div className="bg-primary p-4 rounded-lg">
            <input
              onChange={handleGroupName}
              type="text"
              placeholder="Group Name"
              className="w-full p-2 outline-none rounded-lg mb-3"
            />
            <p className="text-red-400">{groupNameError}</p>
            <input
              onChange={handleGroupIntroName}
              type="text"
              placeholder="Group Intro"
              className="w-full p-2 outline-none rounded-lg"
            />
            <p className="text-red-400">{groupIntroError}</p>
            <button onClick={handleClickGroup} className="button_v_4 py-2 mt-4">
              Create
            </button>
          </div>
        ) : (
          groupList.map((item, i) => {
            return (
              <>
                <div className="flex justify-between items-center mb-3 border-b-2 border-slate-300">
                  <div key={i} className="flex gap-5">
                    <div className="img bg-green-500 w-[50px] h-[50px] rounded-full"></div>
                    <div>
                      <h2 className="font-medium text-base text-red-500 capitalize">
                        {item.adminName}
                      </h2>
                      <h2 className="font-medium text-lg">{item.groupName}</h2>
                      <p className="text-slate-600 text-sm">
                        {item.groupIntro}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        handleJoinGroup(item);
                      }}
                      className="button_v_3"
                    >
                      join
                    </button>
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>
    </>
  );
};

export default GroupList;
