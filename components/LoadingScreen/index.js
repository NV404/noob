import Image from 'next/image'

export default function loading(){
    return(
        <div className="h-screen w-screen absolute top-0 left-0 z-20 flex justify-center items-center bg-black">
            <div className="h-24 w-24 relative animate-pulse"><Image src="/logo.png" layout="fill" /></div>
        </div>
    )
}