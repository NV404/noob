import Head from 'next/head'
import Link from 'next/link'
import Model from 'react-modal'
import Signup from './signup'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/auth'
import LoadingScreen from '../components/LoadingScreen'
import Image from 'next/image'

// select next div
Model.setAppElement("#__next");

export default function Home() {
  const router = useRouter();
  const { loading, user } = useAuth();

  const gotohome = () => {
    router.push('/home')
  }
  
  return (
    <>
    <Head>
      <title>Noob</title>
    </Head>
    {loading ? <LoadingScreen/> : 
      <>
      {/* check if user is loged in */}
      {user ? gotohome() : 
        <div className='w-screen h-screen flex flex-col justify-between py-14 items-center md:flex-row-reverse md:py-0'>
          {/* Right or top section */}
          <div className="text-white w-full px-12 flex flex-col h-3/6 justify-evenly md:w-3/6 md:h-2/6">
            <Image src="/logo.png" className="h-12 w-12" />
            <h2 className="text-2xl font-bold my-5">Join Noob Today</h2>
            <div>
              <Link href="/?signup=true" as="/signup"><a><div className="w-full py-3 bg-purple-550 text-center text-xl font-semibold rounded-lg mb-3 md:max-w-xs">Sign up</div></a></Link>
              <Link href="/login"><a><div className="w-full py-3 border-2 border-purple-550 text-purple-550 text-center text-xl font-semibold rounded-lg md:max-w-xs">Log in</div></a></Link>
            </div>
          </div>
        
          {/* Left or bottom section */}
          <div className="w-full px-12 flex items-center py-10 bg-gray-750 md:w-3/6 md:h-full md:justify-center">
            <h1 className="text-white font-bold text-4xl md:text-7xl md:leading-normal">Connect <br/>With <br/>Humans</h1>
          </div>
        </div>
      }
      </>
    }

    {/* Popup window for signup page */}
    <Model isOpen={!!router.query.signup} className="Model" overlayClassName="Overlay">
      <Signup/>
    </Model>
    </>
  )
}
