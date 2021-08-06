import Link from 'next/link'
import Head from 'next/head'
import { useState } from "react";
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { useRouter } from 'next/router'
import Loading from '../components/LoadingScreen/index'
import Image from 'next/image'

export default function Signup(){
    const { register, user, loading, errorMessage } = useAuth();
    const [registershowerror, setregistershowerror] = useState(null)
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [disable ,setdisable] = useState(false);
    const router = useRouter();


    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var usernameformat = /^(?=[a-zA-Z0-9._]{4,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    const registeruser = (e) => {
        e.preventDefault();
        setdisable(true)

        if (email != null && password != null && username != null) {
            if (email.match(mailformat) && password.length >= 6 && username.match(usernameformat)) {
                setregistershowerror(null);
                db.collection("users")
            .doc(username)
            .onSnapshot((snapshot) => {
                {snapshot.data() == undefined ? register(email,password,username) : setregistershowerror(<p className="text-center text-red-700 font-bold">*Username Already Taken</p>);}
            },(error) =>{
                console.log(error)
            });
            setregistershowerror(null);
<<<<<<< HEAD
=======
            if(user){
                router.push('/home')
            }
>>>>>>> master
            setdisable(false)
            }
            else{
                setdisable(false);
                setregistershowerror(<p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Charaters<br/>*Username lenght 4-12 Charaters without Space without _ or . in end and beginning</p>);
            }
        } else {
            setdisable(false);
            setregistershowerror(<p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Charaters<br/>*Username lenght 4-12 Charaters without Space without _ or . in end and beginning</p>);
        }
    }

    const gotohome = () => {
        router.push('/home')
    }

    return(
        <>
        <Head>
            <title>Signup</title>
        </Head>
        {loading == true ? <Loading/> : 
            <>
            {user ? gotohome() : 
                <div className="w-screen h-screen flex justify-center items-center">
                    <div className="w-full h-full px-10 flex flex-col justify-evenly text-white bg-gray-850 md:max-w-2xl md:h-auto md:py-5 md:items-center md:rounded-lg">
                        <div className="md:w-4/6">
                        <Link href="/"><a className="w-10"><div className="h-10 w-10 relative"><Image src="/logo.png" layout="fill" /></div></a></Link>
                        <h1 className="font-bold text-4xl mt-5">Sign up</h1>
                        <form className="my-5" onSubmit={registeruser}>
                            <div>
                                <label>Email</label><br/>
                                <input onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none border-2 p-2 border-gray-600 rounded-lg w-full focus:border-purple-550" type="email" required/>
                            </div>
                            <div className="mt-3">
                                <label>Password</label><br/>
                                <input onChange={(e) => setPassword(e.target.value)} className="bg-transparent outline-none border-2 p-2 border-gray-600 rounded-lg w-full focus:border-purple-550" type="password" required/>
                            </div>
                            <div className="my-3">
                                <label>Username</label><br/>
                                <input onChange={(e) => setUsername((e.target.value).toLowerCase())} className="bg-transparent outline-none border-2 p-2 border-gray-600 rounded-lg w-full focus:border-purple-550" type="text" required/>
                            </div>
                            <input disabled={disable} type="submit" value="Sign up" className="w-full py-2 bg-purple-550 text-center text-xl font-semibold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"/>
                        </form>
                        <div>
                            {registershowerror? registershowerror : null}
                            {errorMessage ? <><p className='text-center text-red-700 font-bold'>{errorMessage}</p></> : null}
                        </div>
                        <Link href="/login"><a className="font-semibold underline text-center outline-none focus:text-purple-550"><p>Log in</p></a></Link>
                        </div>
                    </div>
                </div>
            }
            </>
        }
        </>
    )
}