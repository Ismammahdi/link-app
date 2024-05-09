import Lottie from "lottie-react";
import Animation from "../assets/Animation - 1706714158779.json";
import { Buttons_v_1 } from "../Comp/Buttons";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const auth = getAuth();

  // navigate
  const navigate = useNavigate();
  // realtime database
  const db = getDatabase();

  // input value starts
  const [fullName, setFullname] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [rePassword, setRePassword] = useState("");
  // input value Ends

  //input error starts

  const [fullNameError, setFullnameError] = useState("");

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [rePasswordError, setRePasswordError] = useState("");

  //input error end
  // set loader
  const [loader, setLoader] = useState(false);

  // Show password
  const [show, setShow] = useState(false);

  // Email regex starts
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const nameRegex = /^[a-zA-Z '.-]*$/;

  const handleFullname = (e) => {
    setFullname(e.target.value);
    setFullnameError("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRePassword = (e) => {
    setRePassword(e.target.value);
    setRePasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) {
      setFullnameError("Enter your fullname");
    } else if (!nameRegex.test(fullName)) {
      setFullnameError("name is not valid");
    } else if (!email) {
      setEmailError("Email is not valid");
    } else if (!emailRegex.test(email)) {
      setEmailError("Email is not valid");
    } else if (!password) {
      setPasswordError("Enter your password");
    } else if (!rePassword) {
      setRePasswordError("Enter your password");
    } else if (password !== rePassword) {
      setRePasswordError("Password not match");
    } else if (
      fullName &&
      nameRegex.test(fullName) &&
      emailRegex.test(email) &&
      email &&
      password == rePassword
    ) {
      setLoader(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL:
              "https://thumbs.dreamstime.com/b/unknown-male-avatar-profile-image-businessman-vector-unknown-male-avatar-profile-image-businessman-vector-profile-179373829.jpg",
          })
            .then(() => {
              // Profile updated!
              toast(" Successfull", {
                position: "top-center",
                theme: "dark",
              });
              setLoader(false);
              setFullname("");
              setEmail("");
              setPassword("");
              setRePassword("");
              // ...
              navigate("/login");
              // ...
            })
            .then(() => {
              set(ref(db, "users/" + auth.currentUser.uid), {
                username: fullName,
                email: email,
              });
            })
            .catch((error) => {
              // An error occurred
              // ...
              console.log(error);
            });
          // Signed up
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage.includes("auth/email-already-in-use")) {
            setEmailError("email already in use");
            toast.error("email already in use");
          }
          console.log(errorCode);
          console.log(errorMessage);
          toast.error("Error!", {
            position: "top-center",

            theme: "dark",
          });
          setLoader(false);
          // ..
        });
    }
  };

  return (
    <>
      <div className="registration bg-tartiary ">
        <div className="container mx-auto flex h-screen items-center justify-between flex-wrap">
          <div className="w-[45%]  login_registration">
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit} className="inputs">
              <input
                onChange={handleFullname}
                type="text"
                value={fullName}
                placeholder="Enter your name"
              />
              <p className="">{fullNameError}</p>

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

              <div className="relative">
                <input
                  onChange={handleRePassword}
                  type={show ? "text" : "password"}
                  value={rePassword}
                  placeholder=" your password"
                />
                {show ? (
                  <FaRegEye
                    onClick={() => {
                      setShow(!show);
                    }}
                    className="absolute font-bold text-primary text-xl right-4 top-[50%] translate-y-[-50%] cursor-pointer"
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
              <p>{rePasswordError}</p>
              {loader ? (
                <div className="flex justify-center items-center">
                  <ColorRing></ColorRing>
                </div>
              ) : (
                <Buttons_v_1 type="submit">submit</Buttons_v_1>
              )}
            </form>
            <p className=" text-primary text-center font-semibold p-2 font-Poppins">
              Already have an account ?
              <Link to="/login" className="underline text-violet-600">
                Login
              </Link>
            </p>
          </div>
          <div className="w-[40%]">
            <h1>Welcome to Link app</h1>
            <Lottie animationData={Animation} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
