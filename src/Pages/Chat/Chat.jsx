import Chatting from "../../Comp/Chatting";
import Friend from "../../Comp/Friend";
import MsgGroup from "../../Comp/MsgGroup";
import Navbar from "../../Comp/Navbar";

const Chat = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="container flex  mx-auto justify-between">
        <div className="w-[31.5%] h-[200px]">
          <div className="mt-5 h-[200px]  mb-5 shadow-lg  border border-gray-300 rounded-lg  pb-4 pl-4 pr-4 pt-0 overflow-y-scroll">
            <Friend></Friend>
          </div>
          <div className="mt-5 h-[200px]  mb-5 shadow-lg  border border-gray-300 rounded-lg  pb-4 pl-4 pr-4 pt-0 overflow-y-scroll">
            <MsgGroup></MsgGroup>
          </div>
        </div>
        <div className="w-[60%]">
          <Chatting></Chatting>
        </div>
      </div>
    </div>
  );
};

export default Chat;
