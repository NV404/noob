import Link from 'next/link'
import { useAuth } from '../../lib/auth'

export default function footer({active}){
    const { user } = useAuth();

    return(
        <div className="flex justify-evenly w-full py-3 z-10 fixed bottom-0 left-0 bg-gray-750 md:hidden">
            <Link href="/home"><a><svg xmlns="http://www.w3.org/2000/svg" className={`fill-current ${active == 'home' ? "text-purple-550" : "text-white"}`} width="24" height="24" viewBox="0 0 24 24"><path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z"/></svg></a></Link>
            <Link href="/search"><a><svg xmlns="http://www.w3.org/2000/svg" className={`fill-current ${active == 'search' ? "text-purple-550" : "text-white"}`}width="24" height="24" viewBox="0 0 24 24"><path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/></svg></a></Link>
            {user ? <Link href={user.displayName}><a><svg xmlns="http://www.w3.org/2000/svg" className={`fill-current ${active == 'profile' ? "text-purple-550" : "text-white"}`} width="24" height="24" viewBox="0 0 24 24"><path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"/></svg></a></Link> : null}
        </div>
    )
}