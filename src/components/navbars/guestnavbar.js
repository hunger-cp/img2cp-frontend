import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

export default function Navbar(props) {

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-2" viewBox="0 0 24 24" fill="none">
            <path d="M12 22H15C18.866 22 22 18.866 22 15V12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22Z" stroke="#EF4444" strokeWidth="1.5"/>
            <path d="M15 22C15 20.1387 15 19.2081 15.2447 18.4549C15.7393 16.9327 16.9327 15.7393 18.4549 15.2447C19.2081 15 20.1387 15 22 15" stroke="#EF4444" strokeWidth="1.5"/>
            </svg>
            <a
              className="text-red-500 text-xl hidden lg:inline-block font-semibold"
            >
              origamihub
            </a>
          </div>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <a className="text-gray-600 block">
              <div className="items-center flex">
              <p className="text-white mr-3"> Start folding </p>
              {/* <p className="text-black mr-3"> {firebase.auth().currentUser.displayName}</p> */}
                <span className="w-12 h-12 text-sm text-white bg-gray-300 inline-flex items-center justify-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" ><path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path></svg>                </span>
                <Link to="/login">
                <button className="ml-3 active:bg-zinc-700 hover:bg-zinc-200 text-black font-normal px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 uppercase inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
              >
                Log In
              </button>
                </Link>
                <Link to="/signup">
                <button className="ml-3 bg-zinc-800 active:bg-zinc-700 text-gray-100 font-normal px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
              >
                Sign Up
              </button>
                </Link>
              </div>
            </a>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}