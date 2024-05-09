import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
// import { getAuth } from "firebase/auth";

const ProfilePicture = ({ imgId }) => {
  let [profilePicture, setProfilePicture] = useState("");

  const storage = getStorage();

  const pictureRef = ref(storage, imgId);

  useEffect(() => {
    getDownloadURL(pictureRef)
      .then((url) => {
        setProfilePicture(url);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div>
      <img className="rounded-full" src={profilePicture} alt="" />
    </div>
  );
};

export default ProfilePicture;
