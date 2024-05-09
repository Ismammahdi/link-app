import "./App.css";
import Registration from "./Pages/Registration";
import firebaseConfig from "./Comp/firebase.config";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/home/Home";
import ForgetPassword from "./Pages/forgetPassword/ForgetPassword";
import Chat from "./Pages/Chat/Chat";

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Registration></Registration>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route
            path="/forgetpassword"
            element={<ForgetPassword></ForgetPassword>}
          ></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/chat" element={<Chat></Chat>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
