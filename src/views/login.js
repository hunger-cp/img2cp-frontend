import React, { useEffect, useState } from "react";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, fetchSignInMethodsForEmail, GoogleAuthProvider} from "firebase/auth";

const provider = new GoogleAuthProvider();
const signInWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorMessage);
        });
}



export default function Login(props) {
    // 0 - email prompting, 1 - password prompting, 2 - invalid email, 3 - wrong password, 4 - too many attempts
    const [stage, setStage] = useState(0);
    const [email, setEmail] = useState(null);

    const emailValidation = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleSubmitEmail = (e) => {
        e.preventDefault();
        const auth = getAuth();
        if (e.target.email.value.match(emailValidation)) {
            fetchSignInMethodsForEmail(auth, e.target.email.value)
            .then((result) => {
                console.log(result)
                if (result.length > 0)
                    setStage(1)
                else 
                    setStage(2)
            }).catch((error) => {
                // Handle Errors here.
                setStage(2)
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log(errorMessage);
            });
        }
        else {
            setStage(2)
        }
    }
    const handleSubmitPassword = (e) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, e.target.password.value)
        .then((result) => {
            console.log(result);
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            // const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == "auth/wrong-password") {
                setStage(3)
            }
            if (errorCode == "auth/too-many-requests") {
                setStage(4)
            }
            // The email of the user's account used.
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorCode);
        });
        
    }
    return (
        <>
            <div className="">
                <section className="header relative items-center flex h-screen justify-center">
                    <div className="rounded-lg border border-gray-200 p-10 flex items-center justify-center flex-col">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 m-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22H15C18.866 22 22 18.866 22 15V12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22Z" stroke="#EF4444" strokeWidth="1"/>
                    <path d="M15 22C15 20.1387 15 19.2081 15.2447 18.4549C15.7393 16.9327 16.9327 15.7393 18.4549 15.2447C19.2081 15 20.1387 15 22 15" stroke="#EF4444" strokeWidth="1"/>
                    </svg>
                        <h2 className=" text-2xl text-center">
                            Welcome to OrigamiHub
                        </h2>
                        { stage != 1 && stage != 3 ? 
                        <form className="flex items-center justify-center flex-col" onSubmit = {(e) => handleSubmitEmail(e)}>
                            { stage != 2 ? 
                            <input id="email" placeholder="Enter your email"  onChange={(e) => {handleChangeEmail(e)}}value={email} className="peer py-3 px-6 mt-6 rounded-lg bg-zinc-200 w-80 focus:bg-white text-medium"></input>
                             : 
                            <div>
                                <input id="email" placeholder="Enter your email"  onChange={(e) => {handleChangeEmail(e)}}value={email} className="peer py-3 px-6 mt-6 rounded-lg border border-red-500 bg-zinc-200 w-80 focus:bg-white text-medium"></input>
                                <span className="mt-2 text-sm text-red-500 block">
                                    Please enter a valid email address or <a href="./signup" className="underline">sign up here</a>
                                </span>
                            </div>
                            }
                            <input type="submit" value="Continue" className="py-3 px-6 rounded-lg mt-4 w-80 bg-gradient-to-r from-red-500 via-pink-500 via-25% to-rose-500 text-white text-lg font-light bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 hover:cursor-pointer"></input>
                        </form>
                        : 
                        <form className="flex items-center justify-center flex-col" onSubmit = {(e) => handleSubmitPassword(e)}>
                            
                            <span className="px-2 mt-2 py-1 text-sm font-semibold text-gray-800 border rounded-xl">{email}</span>
                            {stage != 3 ? 
                            <input id="password" placeholder="Password" type="password" className="py-3 px-6 mt-6 rounded-lg bg-zinc-200 w-80 focus:bg-white text-medium"></input>
                            : 
                             <div>
                                <input id="password" placeholder="Password" type="password" className="py-3 px-6 mt-6 rounded-lg border border-red-500 bg-zinc-200 w-80 focus:bg-white text-medium"></input>
                                {stage == 3 ? <span className="mt-2 text-sm text-red-500 block">
                                    Incorrect password. <a href="./signup" className="underline">Forgot your password?</a>
                                </span> 
                                : 
                                <span className="mt-2 text-sm text-red-500 block">
                                    Too many requests. Please wait a minute
                                </span> }
                            </div>}   
                            <input type="submit" value="Log in" className="py-3 px-6 rounded-lg mt-4 w-80 bg-gradient-to-r from-red-500 via-pink-500 via-25% to-rose-500 text-white text-lg font-light bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 hover:cursor-pointer"></input>
                             
                        </form>
                        }
                        <div className="flex items-center py-5 w-80">
                            <div className="flex-grow h-px bg-zinc-400"></div>
                            <span className="flex-shrink text-zinc-400 px-2">or</span>
                            <div className="flex-grow h-px bg-zinc-400"></div>
                        </div>
                        <button
                            onClick={signInWithGoogle}
                            className="mx-4 bg-gray-200 font-normal px-4 py-2 rounded-lg w-80 text-medium flex items-center justify-center py-3 px-6 text-black hover:bg-gray-300"
                            type="button">
                            <img alt="..." className="w-6 mr-2" src={require("../assets/imgs/google.svg").default} />
                            Continue with Google
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}