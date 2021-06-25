import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import Header from '../components/Header'
import Head from 'next/head'
import Loading from '../components/LoadingScreen'
import Footer from '../components/Footer'
import { useAuth } from '../lib/auth'
import Link from 'next/link'
import NotFound from '../components/NotFound'
import InfiniteScroll from "react-infinite-scroll-component";
import Model from 'react-modal'
import ProfileEdit from '../components/ProfileEdit'
import Post from '../components/Post'
import Loader from '../components/Loader'
import Image from 'next/image'

Model.setAppElement('#__next')

export default function Profile() {
    const router = useRouter()
    const { user, loading } = useAuth();
    const { username } = router.query;
    const [UserProfile, setUserProfile] = useState("notloaded");
    const [imageLoaded, setimageLoaded] = useState(false)
    const [PostDetails, setPostDetails] = useState(null);
    const [lastVisible, setlastVisible] = useState(null);
    const [checkstring, setcheckstring] = useState(null)

    useEffect(async () => {
        if (username) {
            db.collection("users")
                .doc(username)
                .onSnapshot((snapshot) => {
                    setUserProfile(snapshot.data());
                });

                db.collection("posts")
                .where("username", "==", username)
                .orderBy("timestamp", "desc")
                .limit(5)
                .onSnapshot((snapshot) => {
                  var lastVisible = snapshot.docs[snapshot.docs.length-1];
                  setlastVisible(lastVisible);
                  const tempPosts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    post: doc.data(),
                  }));
                  setPostDetails(tempPosts);
                });
        }
    }, [router])


    const postIndex = () => {
        db.collection("posts")
        .where("username", "==", username)
        .orderBy("timestamp", "desc")
        .startAfter(lastVisible)
        .limit(5)
        .onSnapshot((snapshot) => {
          var lastVisible = snapshot.docs[snapshot.docs.length-1];
            setlastVisible(lastVisible);
          const tempPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }));
          setPostDetails(PostDetails => [...PostDetails, ...tempPosts])
        });
        setcheckstring(lastVisible.id)
      }


    const gotologin = () => {
        router.push('/login')
    }

    return (
        <>
            <Head>
                <title>{username}</title>
            </Head>
            <div className="max-w-screen py-8 px-5">
                {/* header */}
                <Header title={`@${username}`} />
                {/* check if user is loaded */}
                {loading == true ? <Loading /> :
                    <>
                        {/* check if user is loged in */}
                        {user ?
                        <>
                        {/* check if user is available with this username or not */}
                        {UserProfile != "notloaded" && UserProfile != undefined ?
                        <div className="md:flex md:justify-evenly w-full">

                            {/* Profile Info */}
                            <div className="md:flex md:h-full md:items-center">
                                <div className="w-full my-6 py-6 px-6 text-white bg-gray-750 rounded-lg md:max-w-sm md:min-w-20">
                                    <div className="flex justify-between md:flex-col md:items-center">
                                        {imageLoaded ?  null : <div className="h-20 w-40 animate-pulse rounded-lg bg-purple-550 md:h-40 md:mx-8 lg:mx-14"></div>}
                                        <div className={`h-20 w-28 overflow-hidden rounded-lg md:h-32 md:w-32 relative md:mx-8 lg:mx-14 ${imageLoaded ? null : "hidden"} `}>
                                        <Image src={UserProfile.profileimage} layout="fill" onLoad={() => setimageLoaded(true)} />
                                        </div>
                                        <div className="h-auto w-full text-center flex flex-col justify-center md:mt-4">
                                            <h1 className="text-xl font-bold uppercase">{UserProfile.name}</h1>
                                            <p className="text-sm">@{UserProfile.username}</p>
                                        </div>
                                    </div>
                                    
                                    {/* If current user metch url then show edit button */}
                                    {user.displayName == router.query.username ? <Link href={`/${user.displayName}?edit=true`}><a><div className="text-center"><p className="py-2 mt-6 font-semibold bg-purple-550 rounded-lg">Setting</p></div></a></Link> : null}
                                    <div className="w-full bg-gray-850 p-3 rounded-lg mt-6 text-center">
                                        <p>{UserProfile.bio}</p>
                                    </div>
                                </div>
                            </div>

                            {/* User feed */}
                            <div className="w-full max-w-lg">
                                {PostDetails == null ? <Loader/> :
                                    <>
                                    {PostDetails.length != 0 ? 
                                        <InfiniteScroll
                                          dataLength={PostDetails.length}
                                          next={postIndex}
                                          hasMore={lastVisible ? <>{lastVisible.id == checkstring ? false : true}</>: null}
                                          loader={<Loader/>}
                                          endMessage={ <h4 className="text-center font-bold mb-4 text-white">The End</h4> }
                                        >
                                            {/* maping fetched data to post component */}
                                          { 
                                            PostDetails.map((post, Index) => (
                                              <Post
                                              key={Index}
                                              id={post.id}
                                              username={post.post.username}
                                              imageUrl={post.post.imageUrl}
                                              caption={post.post.caption}
                                              />
                                            ))
                                          }
                                        </InfiniteScroll>
                                    :
                                        <div className="w-full md:h-96 flex justify-center items-center font-bold text-white md:max-w-lg">
                                            <p>This user do not have any post yet.</p>
                                        </div>
                                    }
                                    </>
                                }      
                            </div>
                        </div>
                        : <>{UserProfile == "notloaded" ? <Loader/> : <NotFound what="USER"/> }</>}
                        </>
                        : gotologin() }
                    </>
                }
            </div>
            {/* Popup window for user profile edit */}
            <Model isOpen={!!router.query.edit} className="Model" overlayClassName="Overlay">
                <ProfileEdit/>
            </Model>
            <Footer active="profile" />
        </>
    )
}