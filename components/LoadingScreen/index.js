import Image from 'next/image'

export default function loading(){
    return(
        <div className="h-screen w-screen absolute top-0 left-0 z-20 flex justify-center items-center bg-black">
            <Image src="/logo.png" className="h-24 w-24 animate-pulse" />
        </div>
    )
}