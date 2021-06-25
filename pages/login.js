import Link from 'next/link'
import Model from 'react-modal'
import Signup from './signup'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '../lib/auth'
import Loading from '../components/LoadingScreen/index'
import Image from 'next/image'

Model.setAppElement("#__next");

export default function Login(){
    const { login, user, loading, errorMessage } = useAuth();
    const [loginshowerror, setloginshowerror] = useState(null)
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [disable, setdisable] = useState(false);
    const router = useRouter();

    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Function to login user
    const loginuser = (e) => {
        e.preventDefault();
        setdisable(true);

        // Input check
        if (email != null && password != null) {
            if (email.match(mailformat) && password.length >= 6) {
                setloginshowerror(null);
                login(email, password);
            }
            else {
                setdisable(false);
                setloginshowerror(<p className='text-center text-red-700 font-bold'>*Email Required<br />*Password length Must be at least 6 Letters</p>);
            }
        } else {
            setdisable(false)
            setloginshowerror(<p className='text-center text-red-700 font-bold'>*Email Required<br />*Password length Must be at least 6 Letters</p>);
        }

    }

    const errorMsg = () => {

    }

    const gotohome = () => {
        router.push('/home')
    }

    return(
        <>
        <Head>
            <title>Login</title>
        </Head>
        {/* check if user is loaded */}
        {loading == true ? <Loading/> : 
            <>
            {/* check if user is available */}
            {user ? gotohome() : 
                <>
                <div className="w-screen h-screen px-12 flex justify-center items-center">
                    <div className="w-full h-2/6 flex flex-col justify-evenly text-white md:max-w-sm">
                        <Link href="/"><a className="w-10"><Image src="/logo.png" className="h-10 w-10" /></a></Link>
                        <h1 className="font-bold text-4xl mt-5">Log in to continue</h1>

                        {/* Login form */}
                        <form className="my-5" onSubmit={loginuser}>
                            <div>
                                <label>Email</label><br/>
                                <input onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none border-2 p-2 border-gray-750 rounded-lg w-full focus:border-purple-550" type="email" required/>
                            </div>
                            <div className="my-3">
                                <label>Password</label><br/>
                                <input onChange={(e) => setPassword(e.target.value)} className="bg-transparent outline-none border-2 p-2 border-gray-750 rounded-lg w-full focus:border-purple-550" type="password" required/>
                            </div>
                            <input disabled={disable} type="submit" value="Log in" className="w-full py-2 bg-purple-550 text-center text-xl font-semibold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"/>
                        </form>

                        {/* input errors */}
                        <div className="mb-5">
                                {loginshowerror ? loginshowerror : null}
                                {errorMessage ? <>{setdisable(false)}<p className='text-center text-red-700 font-bold'>{errorMessage}</p></> : null}
                        </div>
                        <Link href="/login?signup=true" as="/signup"><a className="font-semibold underline text-center outline-none focus:text-purple-550"><p>Don’t have account? sign up</p></a></Link>
                    </div>
                </div>
                {/* Popup window for signup page */}
                <Model isOpen={!!router.query.signup} className="Model" overlayClassName="Overlay">
                  <Signup/>
                </Model>
                </>
            }
            </>
        }
        </>
    )
}