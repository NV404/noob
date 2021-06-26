import '../styles/globals.css'
import { AuthProvider } from '../lib/auth'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return(
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
        <meta name="description" content="Noob - a simple social media site." />
    </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}

export default MyApp
