import ModalImage from "react-modal-image";
import { BsEmojiLaughing } from "react-icons/bs";

import { AiFillAudio } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useState } from "react";
// import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect } from "react";
import { GrGallery } from "react-icons/gr";

// import {
//   getStorage,
//   ref as sref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref as sref,
} from "firebase/storage";

const Chatting = () => {
  let activeChatSlice = useSelector((state) => state.activeChatSlice);

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  const db = getDatabase();
  const storage = getStorage();

  let [message, setMessage] = useState("");
  let [messageList, setMessageList] = useState([]);
  console.log(messageList);

  // handle Message send start
  const handleMessageSend = () => {
    if (message !== "") {
      if (activeChatSlice.active.status === "single") {
        set(push(ref(db, "singleMessage")), {
          whoSendId: data.uid,
          whoSendName: data.displayName,
          whoReceiveId: activeChatSlice.active.id,
          whoReceiveName: activeChatSlice.active.name,
          msg: message,
          date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}, ${
            new Date().getHours() % 12 || 12
          }:${new Date().getMinutes()} ${
            new Date().getHours() >= 12 ? "pm" : "am"
          }`,
        })
          .then(() => {
            console.log("gese");
            setMessage("");
          })
          .catch(() => {
            console.log("jay nai");
          });
      } else {
        console.log("Just a placeholder for handling group messages");
      }
    } else {
      console.log("Cannot send empty message");
    }
  };
  // handle Message send end

  // Data gula nilam start
  useEffect(() => {
    onValue(ref(db, "singleMessage"), (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId == data.uid &&
            item.val().whoReceiveId == activeChatSlice.active.id) ||
          (item.val().whoReceiveId == data.uid &&
            item.val().whoSendId == activeChatSlice.active.id)
        ) {
          arr.push(item.val());
        }
      });
      setMessageList(arr);
    });
  }, [db, data.uid, activeChatSlice.active.id]);

  // Data gula nilam end

  // image upload start
  const handleImageUpload = (e) => {
    console.log(e.target.files[0].name);

    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      () => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "singleMessage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChatSlice.active.id,
            whoReceiveName: activeChatSlice.active.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}, ${
              new Date().getHours() % 12 || 12
            }:${new Date().getMinutes()} ${
              new Date().getHours() >= 12 ? "pm" : "am"
            }`,
          });
        });
      }
    );
  };
  // image upload end

  return (
    <div className=" h-[600px] mb-5 ">
      <div className=" relative mt-5 h-[600px]  mb-5 shadow-lg  border border-gray-300 rounded-lg   pl-4 pr-4 pt-0 overflow-y-scroll  ">
        {/* identity start */}
        <div className="sticky z-10 top-0 left-0 flex gap-5 items-center bg-white border-b border-primary pb-2 pt-2 mb-2">
          <div className="w-[80px] h-[80px] overflow-hidden bg-primary rounded-full">
            <img src="" alt="" />
          </div>

          <div>
            <h2 className="text-base font-bold capitalize ">
              {activeChatSlice.active?.name}
            </h2>
            <p>Online</p>
          </div>
        </div>
        {/* identity end*/}

        {activeChatSlice.active.status == "single" ? (
          messageList.map((item, i) => {
            return item.whoSendId === data.uid ? (
              item.msg ? (
                <div key={i} className="text-right">
                  <div className="inline-block px-3 py-1 rounded-lg bg-primary my-4">
                    <p className="text-white text-left">{item.msg}</p>
                  </div>
                  <p className="text-gray-400">{item.date}</p>
                </div>
              ) : (
                <div key={i} className="text-right">
                  <div className="inline-block  p-1 rounded-lg bg-primary">
                    <ModalImage
                      className="h-[300px] rounded-lg"
                      small={item.img}
                      large={item.img}
                      alt={item.img}
                    />
                  </div>
                  <p className="text-gray-400">{item.date}</p>
                </div>
              )
            ) : //  send message end

            //  receiver message start
            item.msg ? (
              <div key={i} className="text-left">
                <div className="inline-block px-3 py-1 rounded-lg bg-slate-300">
                  <p>{item.msg}</p>
                </div>
                <p className="text-gray-400 text-left">{item.date}</p>
              </div>
            ) : (
              //  receiver message end
              <div key={i} className="text-left">
                <div className="inline-block  p-1 rounded-lg bg-slate-300">
                  <ModalImage
                    className="h-[300px] rounded-lg"
                    small={item.img}
                    large={item.msg}
                    alt={item.msg}
                  />
                </div>
                <p className="text-gray-400 text-left">{item.date}</p>
              </div>
            );
          })
        ) : (
          <h1>group</h1>
        )}

        {/* receiver audio start */}
        {/* <div className="text-left">
          <div className="inline-block  p-1 rounded-full bg-slate-300">
            <audio controls src=""></audio>
          </div>
          <p className="text-gray-400 text-left">2.11</p>
        </div> */}
        {/* receiver audio end */}

        {/* send audio start */}
        {/* <div className="text-right">
          <div className="inline-block  p-1 rounded-full bg-primary my-4">
            <audio controls src=""></audio>
          </div>
          <p className="text-gray-400">2.11</p>
        </div> */}
        {/* send audio end */}

        {/* receiver video start */}
        {/* <div className="text-left">
          <div className="inline-block  p-1 rounded-lg bg-slate-300">
            <video controls src=""></video>
          </div>
          <p className="text-gray-400 text-left">2.11</p>
        </div> */}
        {/* receiver video end */}

        {/* send video start */}
        {/* <div className="text-right">
          <div className="inline-block  p-1 rounded-lg bg-primary my-4">
            <video controls src=""></video>
          </div>
          <p className="text-gray-400">2.11</p>
        </div> */}
        {/* send video end */}

        {/* =================================== */}

        <div className="w-full gap-5 bg-white mb-5  sticky left-0 bottom-0 flex justify-between">
          <div className="w-full gap-5  flex justify-between bg-slate-200 rounded-lg items-center">
            <div className="w-full ">
              <input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                type=" text"
                placeholder="Type a message"
                className="w-full input border  border-primary py-2  rounded-lg outline-none"
              />
            </div>
            <div className="flex gap-5 items-center mr-2">
              <button className="">
                <BsEmojiLaughing className="text-[23px] text-primary " />
              </button>
              <button className="">
                <AiFillAudio className="text-[23px] text-primary " />
              </button>
              <label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  className="hidden"
                />

                <GrGallery className="text-3xl text-primary " />
              </label>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleMessageSend}
              className="px-4 py-3  bg-violet-700 rounded-lg font-bold text-white"
            >
              Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
