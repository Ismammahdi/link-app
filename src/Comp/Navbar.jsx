import { Link, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slice/userSlice";
import { FaCloudDownloadAlt } from "react-icons/fa";
import Cropper from "react-cropper";
import { useState } from "react";
import "cropperjs/dist/cropper.css";
import { createRef } from "react";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

// import React, { useState, createRef } from "react";

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();

  const dichpatch = useDispatch();

  const data = useSelector((state) => state.userLoginInfo.userInfo);

  const [modal, setModal] = useState(false);

  // Close Modal
  const closeModal = () => {
    setModal(false);
  };

  // image croper start
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  // image croper end

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        dichpatch(userLoginInfo(null));
        localStorage.removeItem("user");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const handleImg = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    console.log(files);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      // console.log(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then(() => {
        // console.log("Uploaded a data_url string!");

        getDownloadURL(storageRef).then((getDownloadURL) => {
          console.log(getDownloadURL);

          updateProfile(auth.currentUser, {
            photoURL: getDownloadURL,
          });

          dichpatch(userLoginInfo({ ...data, photoURL: getDownloadURL }));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...data, photoURL: getDownloadURL })
          );
          setModal(false);
        });
      });
    }
  };
  console.log(cropData);

  return (
    <>
      <nav id="navbar" className="bg-primary py-[5px]">
        <div className="main_menu container mx-auto flex items-center justify-between">
          <div className="profile gap-5 flex items-center">
            <div className="img relative group">
              <img src={data?.photoURL} alt="this is image" />
              {/* <h2 className="defaultPhoto">{data?.displayName[0]}</h2> */}
              <div className="overlay hidden group-hover:block ">
                <FaCloudDownloadAlt onClick={setModal} />
              </div>
            </div>
            <h2>{data?.displayName}</h2>
          </div>
          <div className="menu-items">
            <Link to={"/home"}>
              <IoHomeOutline />
            </Link>
            <Link to={"/chat"}>
              <IoChatbubbleEllipsesOutline />
            </Link>
            <Link>
              <FaRegBell />
            </Link>
            <Link>
              <IoSettingsOutline />
            </Link>
            <div className="cursor-pointer" onClick={handleLogOut}>
              <RiLogoutBoxRFill />
            </div>
          </div>
        </div>
      </nav>

      {modal && (
        <div className="modal ">
          <div className="profileImg">
            <h2 className="text-2xl text-center text-primary font-Poppins font-semibold">
              Update your profile picture
            </h2>
            <div className=" mx-auto flex mr-[-20%] justify-center">
              <input onChange={handleImg} type="file" className="my-2 " />
            </div>
            <div className="bg-black h-[100px] w-[100px] overflow-hidden mx-auto rounded-full">
              <div className="img-preview h-full w-full " />
            </div>
            {image && (
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
              />
            )}
            <div className="flex  justify-center w-[50%] mx-auto gap-5  items-center ">
              <button onClick={getCropData} className="button_v_3">
                Upload
              </button>
              <button
                onClick={closeModal}
                className="button_v_4 bg-red-400  hover:bg-red-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
