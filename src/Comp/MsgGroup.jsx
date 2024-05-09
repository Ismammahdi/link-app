import { useState, useEffect } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { useSelector } from "react-redux";

const MsgGroup = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  // get input value

  let [groupList, setGroupList] = useState([]);

  console.log(groupList);

  // get my group list end
  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push({ ...item.val(), id: item.key });
      });
      setGroupList(list);
    });
  }, []);

  // get my group list end

  // handle join group start

  // handle join group end

  return (
    <>
      <div className="mb-4 relative">
        <div className="title sticky left-0 right-0">
          <h2 className="py-2 font-semibold text-xl">Group List</h2>
        </div>

        {groupList.map((item, i) => {
          return (
            <div
              key={item.id}
              className="flex justify-between items-center mb-3 border-b-2 border-slate-300"
            >
              <div className="flex gap-5">
                <div className="img bg-green-500 w-[50px] h-[50px] rounded-full"></div>
                <div>
                  <h2 className="font-medium text-base text-red-500 capitalize">
                    {item.adminName}
                  </h2>
                  <h2 className="font-medium text-lg">{item.groupName}</h2>
                  <p className="text-slate-600 text-sm">{item.groupIntro}</p>
                </div>
              </div>
              <div>
                <button className="button_v_3">Message</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MsgGroup;
