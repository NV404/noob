import Header from '../components/Header'
import Footer from '../components/Footer'
import Head from 'next/head'
import { useState } from 'react'
import { db } from '../lib/firebase'
import { useAuth } from '../lib/auth'
import { useRouter } from 'next/router'
import LoadingScreen from '../components/LoadingScreen'
import Loader from '../components/Loader'
import Link from 'next/link'
import Image from 'next/image'

export default function Search(){
    const { user, loading } = useAuth()
    const [term, setTerm] = useState(null)
    const [result, setResult] = useState(null)
    const [loadingResults, setLoadingResults] = useState(false)
    const router = useRouter();

    const Search = (e) => {
        e.preventDefault();
        setLoadingResults(true)
        setResult(null)
        if(term != null){
            db.collection('users')
            .orderBy("username")
            .startAt(term)
            .endAt(term + "\uf8ff")
            .get()
            .then((snapshot) => {
                var tempResult = (snapshot.docs.map((docs) => ({
                    id: docs.id,
                    post: docs.data()
                })))
                setResult(tempResult)
                setLoadingResults(false)
            })
        }
        else{
            setLoadingResults(false)
        }
    }

    const gotologin = () => {
        router.push('/login')
    }
    return(
        <>
        <Head>
            <title>Search</title>
        </Head>
            {loading ? <LoadingScreen/> : 
                <>
                {user ? 
                    <>
                        <div className="py-8 px-5 min-h-screen w-screen text-white">
                            <Header title="Search"/>
                            {/* search box */}
                            <div className="my-4">
                                <form onSubmit={Search} className="w-full flex flex-col justify-center md:flex-row" >
                                    <input onChange={(e) => setTerm(e.target.value.toLowerCase())} type="text" className="mb-2 bg-transparent border-2 outline-none border-gray-500 rounded-lg p-2 md:mr-2 md:mb-0 md:w-2/6 focus:border-purple-550"/>
                                    <input type="submit" value="Search" className="bg-purple-550 px-3 py-3 rounded-lg" />
                                </form>
                            </div>

                            {/* results */}
                            <div className="mb-20">
                                {loadingResults ? <Loader/> : null}
                                {result && result.length != 0? 
                                    <>
                                    {
                                        result.map((post, Index) => (
                                            <div className="flex w-full flex-col items-center" key={Index}>
                                                <Link href={post.post.username}><a>
                                                    <div className="w-full my-6 py-6 px-6 text-white bg-gray-750 rounded-lg md:max-w-md">
                                                        <div className="flex justify-between">
                                                            <Image src={post.post.profileimage} className="h-20 rounded-lg" />
                                                            <div className="h-auto w-full text-center flex flex-col justify-center ">
                                                                <h1 className="text-xl font-bold uppercase">{post.post.name}</h1>
                                                                <p className="text-sm">@{post.post.username}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-gray-850 p-3 rounded-lg mt-6 text-center">
                                                            <p>{post.post.bio}</p>
                                                        </div>
                                                    </div>
                                                </a></Link>
                                            </div>
                                        ))
                                    }
                                    </>
                                : <>{loadingResults == false ? <>{result ? <p className="text-center">0 results found</p>: null}</> : null}</>}
                            </div>
                        </div>
                    </>
                : gotologin() }
                </>
            }
            <Footer active="search"/>
        </>
    )
}