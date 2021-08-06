import Image from 'next/image'

export default function notfound({what}){
    return(
        <div className="h-96 w-full flex flex-col items-center justify-evenly md:flex-row">
            <div className="h-full"><div className="w-96 h-96 relative"><Image src="/404.png" objectFit="contain" layout="fill"/></div></div>
            <div className="flex h-56 text-center text-white items-center text-2xl font-bold md:text-4xl">
                <h1>404 {what} <br/>NOT FOUND</h1>
            </div>
        </div>
    )
}