import { useEffect, useState } from "react";
// import { Buttons_v_3 } from "./Buttons";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

const BlockList = () => {
  const [blockList, setBlockList] = useState([]);
  const db = getDatabase();

  const data = useSelector((state) => state.userLoginInfo.userInfo);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().blockById) {
          list.push({
            id: item.key,
            block: item.val().block,
            blockId: item.val().blockId,
          });
        } else {
          list.push({
            id: item.key,
            blockBy: item.val().block,
            blockById: item.val().blockById,
          });
        }
      });
      setBlockList(list);
    });
  }, []);

  // Unblock handling starts
  const handleUnblock = (item) => {
    set(push(ref(db, "friend")), {
      senderId: item.blockId,
      senderName: item.block,
      reciverId: data.uid,
      reciverName: data.displayName,
    }).then(() => {
      remove(ref(db, "block/" + item.id));
    });
  };
  // Unblock handling ends

  return (
    <>
      <div className="">
        <div className="title flex justify-between items-center">
          <div className="text">
            <h1>Block User</h1>
          </div>
        </div>
        {blockList.map((item, i) => {
          return (
            <div
              key={i}
              className="flex justify-between items-center border-b-2 border-slate-300 mb-2"
            >
              <div className="flex gap-5">
                <div className="img w-[50px] h-[50px] bg-green-500 rounded-full">
                  {item.blockById ? (
                    <ProfilePicture imgId={item.blockById} />
                  ) : (
                    <ProfilePicture imgId={item.blockId} />
                  )}
                </div>
                <div className="">
                  <h1 className="font-semibold">
                    {item.block ? item.block : item.blockBy}
                  </h1>
                  <p className="text-slate-600 text-sm ">ismam@gmail.com</p>
                </div>
              </div>
              <div>
                {item.blockById ? (
                  <button className={"button_v_3 font-semibold"}>
                    I Block you
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnblock(item)}
                    className={"button_v_5 font-semibold"}
                  >
                    Unblock
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

export default BlockList;
