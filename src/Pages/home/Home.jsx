import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Comp/Navbar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import GroupList from "../../Comp/GroupList";
import UserList from "../../Comp/UserList";
import FriendList from "../../Comp/FrindList";
import FriendRequest from "../../Comp/FriendRequest";
import MyGroup from "../../Comp/MyGroup";
import BlockList from "../../Comp/BlockList";

const Home = () => {
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  console.log(data);
  const navigate = useNavigate();
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  });
  return (
    <>
      <Navbar></Navbar>
      <div className="">
        <div className="search relative">
          <input type="search" placeholder="Search" />
          <div>
            <IoSearchOutline className="absolute top-[50%] translate-y-[-50%] left-6" />
          </div>
          <div className="absolute left-[31%] top-[50%] translate-y-[-50%]">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className=" main-content relative">
          {/* group list start */}
          <div className="item">
            <GroupList></GroupList>
          </div>
          {/* grouplist end */}

          {/* Friend list start */}
          <div className="item">
            <FriendList></FriendList>
          </div>
          {/* Friend list end */}

          {/* userlist start */}
          <div className="item">
            <UserList></UserList>
          </div>
          {/* userlist end */}

          {/* Friend request start */}
          <div className="item">
            <FriendRequest></FriendRequest>
          </div>
          {/* Friend request end */}

          {/* Block list starts */}
          <div className="item">
            <BlockList></BlockList>
          </div>
          {/* Block list end */}

          {/* My group starts */}
          <div className="item">
            <MyGroup></MyGroup>
          </div>
          {/* My group end */}
        </div>
      </div>
    </>
  );
};

export default Home;
