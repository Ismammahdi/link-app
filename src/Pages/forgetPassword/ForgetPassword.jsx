import { useState } from "react";
import { Buttons_v_1 } from "../../Comp/Buttons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleinput = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email is empty");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          toast.success(" success");
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          toast.error(" error");
          // ..
        });
    }
  };

  return (
    <div
      id="forgetPassword"
      className="flex justify-between bg-primary items-center h-screen"
    >
      <div className="mx-auto w-[450px] p-10 rounded-xl bg-white ">
        <h2 className="text-2xl font-bold text-primary mb-5">
          Forget Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleinput}
            className="w-full px-3 py-2 outline-2 outline-green-600 rounded-md placeholder:text-green-500 border-2 border-green-700"
            type="email"
            placeholder="Enter your email"
          />
          <p>{emailError}</p>
          <div className=" flex justify-between gap-10 mt-5 items-center">
            <Buttons_v_1>Send</Buttons_v_1>
            <Buttons_v_1>
              <Link to={"/login"}>Login</Link>
            </Buttons_v_1>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
