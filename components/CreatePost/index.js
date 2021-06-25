import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { db, storage } from '../../lib/firebase';
import firebase from "firebase/app";
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Createpost(){
    const {user} = useAuth()
    const [Caption, setCaption] = useState(null);
    const [Image, setImage] = useState(null)
    const [ImagePreview, setImagePreview] = useState(null);
    const [Progress, setProgress] = useState(0)
    const [uploadError, setUploadError] = useState(false)
    const [disable, setdisable] = useState(false);
    var randomstring = require("randomstring");
    const router = useRouter()

    const addimage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                var dataURL = reader.result;
                setImagePreview(dataURL);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };


    // Profile image update function
    const UploadPost = (e) => {
        setdisable(true)
        e.preventDefault();
        if(Image != null && Caption != null){
            var randomtxt = randomstring.generate(10);
            var uploadTask = storage.ref(`PostImages/${randomtxt+Image.name}`).put(Image);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 1000
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                        .ref("PostImages")
                        .child(randomtxt+Image.name)
                        .getDownloadURL()
                        .then((url) => {
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                imageUrl: url + "?alt=media",
                                username: user.displayName,
                                caption: Caption,
                            }).then((snap) => {
                                db.collection("posts")
                                .doc(snap.id)
                                .collection("likes")
                                .doc("total")
                                .set({
                                    count: 0
                                })
                                db.collection("posts")
                                .doc(snap.id)
                                .collection("comments")
                                .doc("total")
                                .set({
                                    count: 0
                                })
                            })
                            setImage(null);
                            setdisable(false)
                            setImagePreview(null);
                            setProgress(0);
                            router.push("/home");
                        })
                },
                (error) => {
                    // Handle unsuccessful uploads
                    setdisable(false)
                }
            );
        }
        else{
            setUploadError(true);
        }
    }


    return(
        <>
        <div className="h-screen w-screen bg-gray-850 overflow-y-scroll p-8 text-white rounded-lg md:max-w-md md:h-auto md:max-h-screen">
            {/* header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/home"><a><Image src="/logo.png" className="h-10 w-10"/></a></Link>
                    <p className="font-bold text-2xl pl-2">Edit Profile</p>
                </div>
                <Link href="/home"><a><Image src="/cross.svg" /></a></Link>
            </div>

            {/* Main Content */}
            <div className="mt-8 mb-20 md:mb-0">
                <form>
                    <div className="mb-5">
                        <div className="mb-5 flex justify-center items-center">
                            {/* image preview */}
                            {ImagePreview ? <>
                                <Image src={ImagePreview} className="rounded-lg w-full"/>
                            </> : null}
                        </div>

                        {/* Image upload Progress Bar */}
                        {Progress != 0 ?
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                                    <div style={{ width: Progress+'%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                                </div>
                            </div>
                        : null }

                        <div className="bg-purple-550 text-center rounded-lg py-3 font-semibold cursor-pointer">
                            <label className="cursor-pointer">
                                <p>Change Image</p>
                                <input type='file' accept="image/*" onChange={addimage} className="hidden" required/>
                            </label>
                        </div>
                    </div>
                    <div className="my-4">
                        <label>Caption</label><br/>
                        <textarea maxLength="100" rows="4" onChange={(e) => setCaption(e.target.value)} className="bg-transparent resize-none outline-none border-2 p-2 border-gray-750 rounded-lg w-full focus:border-purple-550" type="text" required/>
                    </div>
                    <div>
                        {uploadError ? <p className="text-red-700 text-center font-semibold">Image and Bio is required.</p> : null}
                    </div>
                    <div>
                        <button disabled={disable} onClick={UploadPost} className="w-full bg-purple-550 text-center rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Upload</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}