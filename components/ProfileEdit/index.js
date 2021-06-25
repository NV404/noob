import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth'
import { auth, db, storage } from '../../lib/firebase';
import { useRouter } from 'next/router';
import Image from 'next/image'

export default function ProfileEdit(){
    const { user, logout } = useAuth();
    const [name, setName] = useState(null)
    const [bio, setBio] = useState(null)
    const [image, setImage] = useState(null);
    const [ImagePreview, setImagePreview] = useState(null);
    const [Progress, setProgress] = useState(0);
    var randomstring = require("randomstring");
    const router = useRouter();
    const [UserProfile, setUserProfile] = useState(null);

    useEffect(async () => {
        if (user) {
            db.collection("users")
                .doc(user.displayName)
                .onSnapshot((snapshot) => {
                    setUserProfile(snapshot.data());
                    setName(snapshot.data().name)
                    setBio(snapshot.data().bio)
                });
        }
    }, [router])


    // this function Create a preview Image
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
    const imageupload = (e) => {
        e.preventDefault();
        var randomtxt = randomstring.generate(10);
        var uploadTask = storage.ref(`ProfileImages/${randomtxt+image.name}`).put(image);
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
                    .ref("ProfileImages")
                    .child(randomtxt+image.name)
                    .getDownloadURL()
                    .then((url) => {
                        auth.currentUser.updateProfile({
                            photoURL: url + "?alt=media",
                        })
                        db.collection("users")
                        .doc(auth.currentUser.displayName).update({
                            profileimage: url + "?alt=media",
                        })
                        setImage(null);
                        setImagePreview(null);
                        setProgress(0);
                        router.push(user.displayName);
                    })
            },
            (error) => {
                // Handle unsuccessful uploads
            }
        );
    }

    const updateInfo = () => {
        db.collection("users")
        .doc(auth.currentUser.displayName).update({
            name: name,
            bio: bio
        }).then(
            router.push(user.displayName)
        )
    }


    return(
        <>
            <div className="h-screen w-screen overflow-scroll flex flex-col p-8 bg-gray-850 rounded-lg text-white md:max-w-md md:h-auto">
            {user ? <>
                    {/* header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/home"><a><div className="h-10 w-10 relative"><Image src="/logo.png" layout="fill"/></div></a></Link>
                            <p className="font-bold text-2xl pl-2">Edit Profile</p>
                        </div>
                        <Link href={user.displayName}><a><div className="relative h-6 w-6"><Image src="/cross.svg" layout="fill" /></div></a></Link>
                    </div>

                    <div className="mt-8">
                        <form>
                            <div className="mb-5">
                                <div className="mb-5 flex justify-evenly items-center">
                                    <div className="rounded-lg h-20 w-20 overflow-hidden relative"><Image layout="fill" src={user.photoURL}/></div>
                                    {ImagePreview ? <>
                                        <div className="rounded-lg h-20 w-20 overflow-hidden relative"><Image layout="fill" src={ImagePreview}/></div>
                                    </> : null}
                                </div>
                                {/* If any image is selected it will change button Select button to save button */}
                                {ImagePreview ? 
                                    <div onClick={imageupload} className="bg-purple-550 text-center rounded-lg py-3 font-semibold cursor-pointer">
                                        <label className="cursor-pointer">
                                            <p>Save</p>
                                        </label>
                                    </div>
                                :
                                    <div className="bg-purple-550 text-center rounded-lg py-3 font-semibold cursor-pointer">
                                        <label className="cursor-pointer">
                                            <p>Change Image</p>
                                            <input type='file' accept="image/*" onChange={addimage} className="hidden" />
                                        </label>
                                    </div>
                                }
                            </div>
                            <div>
                                <label>Name</label><br/>
                                <input value={name ? name : ""} maxLength="12" onChange={(e) => setName(e.target.value)} className="bg-transparent outline-none border-2 p-2 border-gray-750 rounded-lg w-full focus:border-purple-550" type="text" required/>
                            </div>
                            <div className="my-4">
                            <label>Bio</label><br/>
                                <textarea value={bio? bio : ""} maxLength="40" rows="2" onChange={(e) => setBio(e.target.value)} className="bg-transparent resize-none outline-none border-2 p-2 border-gray-750 rounded-lg w-full focus:border-purple-550" type="text" required/>
                            </div>
                            <div className="mb-20 md:mb-0">
                                <button onClick={updateInfo} className="w-full bg-purple-550 text-center rounded-lg py-3 font-semibold">Save</button>
                                <button onClick={logout} className="w-full mt-3 bg-red-500 text-center rounded-lg py-3 font-semibold">Log out</button>
                            </div>
                        </form>
                    </div>
                </>
                : null }

            </div>
        </>
    )
}