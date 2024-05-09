import Lottie from "lottie-react";
import Animation from "../../assets/lottie2.json";
import { Buttons_v_1 } from "../../Comp/Buttons";

import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
// import useNavigate from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slice/userSlice";

const Login = () => {
  // Dichpach giving data
  const dispatch = useDispatch();

  // dichpatch end
  // navigation
  const navigation = useNavigate();

  const auth = getAuth();
  // navigate

  // input value starts

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // input value Ends

  //input error starts

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

  //input error end

  // set loader
  const [loader, setLoader] = useState(false);

  // Show password
  const [show, setShow] = useState(false);

  // Email regex starts

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email is not valid");
    } else if (!password) {
      setPasswordError("Enter your password");
    } else if (email && password) {
      setLoader(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          toast(" Successfull", {
            position: "top-center",
            theme: "dark",
          });
          setLoader(false);
          dispatch(userLoginInfo(user));
          setPassword("");
          localStorage.setItem("user", JSON.stringify(user));
          navigation("/home");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/invalid-credential") {
            setPasswordError("wrong password");
            toast.error("wrong password");
          }
          if (errorMessage === "Firebase: Error (auth/invalid-credential).") {
            setEmailError("Wrong email");
            toast.error("wrong email");
            setLoader(false);
          }
          console.log(errorCode);
          console.log(errorMessage);

          setPassword("");
          setPasswordError("");
          // ..
        });
    }
  };

  return (
    <>
      <div className="registration bg-tartiary ">
        <div className="container mx-auto flex h-screen items-center justify-between flex-wrap">
          <div className="w-[40%]">
            <h1>Welcome to Link app</h1>
            <Lottie animationData={Animation} />
          </div>
          <div className="w-[45%]  login_registration">
            <h2 className="uppercase">Log in</h2>
            <form onSubmit={handleSubmit} className="inputs">
              <input
                onChange={handleEmail}
                type="email"
                value={email}
                placeholder="Email"
              />
              <p>{emailError}</p>
              <div className="relative">
                <input
                  onChange={handlePassword}
                  type={show ? "text" : "password"}
                  value={password}
                  placeholder=" your password"
                />
                {show ? (
                  <FaRegEye
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="absolute text-primary text-xl font-bold right-4 top-[50%] translate-y-[-50%] cursor-pointer"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="absolute font-bold text-primary text-xl right-4 top-[50%] translate-y-[-50%] cursor-pointer"
                  />
                )}
              </div>
              <p>{passwordError}</p>

              {loader ? (
                <div className="flex justify-center items-center">
                  <ColorRing></ColorRing>
                </div>
              ) : (
                <Buttons_v_1 type="submit">submit</Buttons_v_1>
              )}
            </form>
            <div className="flex justify-between items-center">
              <p className=" text-primary text-center font-semibold p-2 font-Poppins">
                Registration first ?
                <Link
                  to="/"
                  className="underline font-bold ml-3 text-violet-600"
                >
                  <span> Registration</span>
                </Link>
              </p>
              <Link
                to="/forgetpassword"
                className="underline font-bold ml-5 text-violet-600"
              >
                <span> Forget password</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
