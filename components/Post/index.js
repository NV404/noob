import Link from 'next/link'
import { db } from '../../lib/firebase'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth'
import firebase from 'firebase/app'
import Image from 'next/image'

export default function Post({
  id,
  username,
  imageUrl,
  caption}) 
  {

    const [Profileurl, setProfileurl] = useState(null)
    const [imageLoaded, setimageLoaded] = useState(false)
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [disable, setdisable] = useState(false);
    const { user } = useAuth()

    // get total like count
    useEffect(() => {
        db.collection("posts")
        .doc(id)
        .collection("likes")
        .doc("total")
        .onSnapshot((snap) => {
            setLikes(snap.data().count)
        });
    },[])

    // get user information 
    useEffect(() => {
        db.collection("users")
        .doc(username)
        .onSnapshot((snapshot) => {
            setProfileurl(snapshot.data().profileimage)
        });
    },[])

    // check if user liked this post already
    useEffect(() => {
        const getifliked = db.collection("posts")
        .doc(id)
        .collection("likes")
        .doc(user.displayName)
        .get()
        .then((snap) => {
            if(snap.exists){
                setLiked(true)
                setdisable(false)
            }
            else{
                setLiked(false)
                setdisable(false)
            }
        });
        
        return () => getifliked;
    },[liked])

    const addlike = () => {
        setdisable(true)
        if(user){
            if(liked == false){
                if(disable == false){
                let dbref = db.collection("posts").doc(id).collection("likes")
                
                dbref
                .doc(user.displayName)
                .set({
                    liked: true,
                })

                dbref
                .doc("total")
                .update({
                    count: firebase.firestore.FieldValue.increment(1)
                }).then(() => {
                    dbref
                    .doc("total")
                    .onSnapshot((snapshot) => {
                        setLikes(snapshot.data().count)
                        setLiked(true)
                    })
                })
            }
            }
        }
    }

    const dislike = () => {
        setdisable(true)
        if(user){
            if(liked == true){
                let dbref = db.collection("posts").doc(id).collection("likes")

                dbref
                .doc(user.displayName)
                .delete()

                dbref
                .doc("total")
                .update({
                    count: firebase.firestore.FieldValue.increment(-1)
                }).then(() => {
                    dbref
                    .doc("total")
                    .onSnapshot((snapshot) => {
                        setLikes(snapshot.data().count)
                        setLiked(false)
                    })
                })
            }
        }
    }


    return(
        <>
        <div className="w-full bg-gray-750 my-3 p-3 rounded-lg text-white break-words">
            <Link href={`/${username}`}><a>
                <div className="flex">
                    {Profileurl ? <div className="h-8 w-8 rounded-md overflow-hidden mr-2 relative"><Image src={Profileurl} layout="fill"/></div> : null}
                    <p className="font-semibold">{username}</p>
                </div>
            </a></Link>
            <div className="flex justify-center">
                {imageLoaded ?  null : <div className="w-full h-80 animate-pulse rounded-lg bg-purple-550 my-1"></div>}
                <div className={`w-full relative h-60 overflow-hidden rounded-lg my-1 md:h-96 ${imageLoaded ? null : "hidden"}`}><Image src={imageUrl} layout="fill" objectFit="contain" onLoad={() => setimageLoaded(true)}/></div>
            </div>

            <div className="w-full flex">
                {/* like button */}
                <button disabled={disable} onClick={liked == true ? dislike : addlike} className="flex items-center p-2 bg-gray-850 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${liked == true ? "text-purple-550" : "text-white"} fill-current viewBox="0 0 24 24`}><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                    <p className="font-semibold ml-2 text-white">{likes} Likes</p>
                </button>
            </div>
            
            {/* caption */}
            <p><span className="underline font-semibold"><Link href={`/${username}`}><a>{username}:</a></Link></span> {caption}</p>
        </div>
        </>
    )
}