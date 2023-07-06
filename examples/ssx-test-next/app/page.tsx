import SSXComponent from '@/components/SSXComponent';

export default function Home() {
  return (
    <div className='App'>
      <div className='Header'>
        <span className='Header-span'>
          SSX
        </span>
      </div>
      <div className='Title'>
        <h1 className='Title-h1'>
          SSX Test App
        </h1>
        <h2 className='Title-h2'>
          Connect and sign in with your Ethereum account
        </h2>
      </div>
      <div className='Content'>
        <div className='Content-container'>
          <SSXComponent />
        </div>
      </div>
    </div>
  )
}