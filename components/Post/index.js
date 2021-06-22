import Link from 'next/link'
import { db } from '../../lib/firebase'
import { useState, useEffect } from 'react'
import Model from 'react-modal'
import { useAuth } from '../../lib/auth'

Model.setAppElement('#__next')

export default function post({
  id,
  username,
  imageUrl,
  caption}) 
  {

    const [Profileurl, setProfileurl] = useState(null)
    const [imageLoaded, setimageLoaded] = useState(false)
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const { user } = useAuth()

    useEffect(() => {
        const getUserInfo = db.collection("users")
        .doc(username)
        .onSnapshot((snapshot) => {
            setProfileurl(snapshot.data().profileimage)
        });

        const getTotalLink = db.collection("posts")
        .doc(id)
        .collection("likes")
        .doc("total")
        .onSnapshot((snap) => {
            setLikes(snap.data().count)
        });

        // const getTotalComment = db.collection("posts")
        // .doc(id)
        // .collection("comments")
        // .doc("total")
        // .onSnapshot((snap) => {
        //     setComments(snap.data().count)
        // });

        return () => getUserInfo(), getTotalLink();
    },[])

    const addlike = () => {
        console.log("in the function")
        if(user){
            console.log("in the function with user")
            db.collection("posts")
            .doc(id)
            .collection("likes")
            .doc("total")
            .onSnapshot((snap) => {
                db.collection("posts")
                .doc(id)
                .collection("likes")
                .doc(user.displayName)
                .set({
                    liked: "True",
                })
            
                db.collection("posts")
                .doc(id)
                .collection("likes")
                .doc("total")
                .set({
                    count: snap.data().count + 1,
                }).then(
                    db.collection("posts")
                    .doc(id)
                    .collection("likes")
                    .doc("total")
                    .onSnapshot((snapshot) => {
                        setLikes(snapshot.data().count)
                    })
                )
            })
        }
    }
    return(
        <>
        <div className="w-full bg-gray-750 my-3 p-3 rounded-lg text-white break-words">
            <Link href={`/${username}`}><a>
                <div className="flex">
                    {Profileurl ? <img src={Profileurl} className="h-8 w-8 rounded-md mr-2"/> : null}
                    <p className="font-semibold">{username}</p>
                </div>
            </a></Link>
            <div className="flex justify-center">
                {imageLoaded ?  null : <div className="w-full h-80 animate-pulse rounded-lg bg-purple-550 my-1"></div>}
                <img src={imageUrl} className={`max-w-full rounded-lg my-1 max-h-96 ${imageLoaded ? null : "hidden"}`} onLoad={() => setimageLoaded(true)}/>
            </div>
            <div className="w-full flex justify-between">
                {/* like button */}
                <button onClick={addlike} className="flex items-center p-2 bg-gray-850 rounded-lg cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                    <p className="font-semibold ml-2 text-white">{likes} Likes</p>
                </button>
                {/* comment button */}
                <div className="flex items-center p-2 bg-gray-850 rounded-lg cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white fill-current" fillRule="evenodd" clipRule="evenodd"><path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625l-1.993 6.368 6.946-3c1.705.439 3.334.641 4.864.641 7.174 0 12.136-4.439 12.136-9.634 0-5.812-5.701-10.007-12-10.007zm0 1c6.065 0 11 4.041 11 9.007 0 4.922-4.787 8.634-11.136 8.634-1.881 0-3.401-.299-4.946-.695l-5.258 2.271 1.505-4.808c-1.308-1.564-2.165-3.128-2.165-5.402 0-4.966 4.935-9.007 11-9.007zm-5 7.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/></svg>
                    <p className="font-semibold ml-2 text-white">{comments} Comments</p>
                </div>
            </div>
            {/* caption */}
            <p><span className="underline font-semibold"><Link href={`/${username}`}><a>{username}:</a></Link></span> {caption}</p>
        </div>
        <Model>

        </Model>
        </>
    )
}