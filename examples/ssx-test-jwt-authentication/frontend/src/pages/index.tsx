import { useState } from 'react'
import { SSX } from '@spruceid/ssx'
import axios from 'axios'

export default function Home() {
    const API_URL = 'http://localhost:8000'

    const [ jwt, setJwt ] = useState<string | undefined>()
    const [ secret, setSecret ] = useState<string | undefined>()
    const [ error, setError ] = useState<string | undefined>()

  const ssx = (driver: any) => new SSX({
    enableDaoLogin: false,
    resolveEns: false,
    providers: {
      web3: {
        driver,
      },
      server: {
        host: API_URL,
      },
    },
  })

  const signIn = async () => {
    const res = await ssx(window.ethereum).signIn()

    setJwt(res.jwt)
  }

  const fetchSecret = async () => {
    const res = await axios.get(
      `${ API_URL }/private-route`,
      {
        headers: { Authorization: `Bearer ${ jwt }` }
      },
    )

    setSecret(res.data.secret)
  }

  const fetchSecretWithTamperedJWT = async () => {
    try {
      const res = await axios.get(
        `${ API_URL }/private-route`,
        {
          headers: { Authorization: `Bearer ${ jwt }0` }
        },
      )
    } catch (error: any) {
      setError(error.response.data.message)
    }
  }
  
  return (
    <div>
        { jwt ? (
            <>
                <button onClick={fetchSecret}>
                    Fecth secret
                </button>

                <button onClick={fetchSecretWithTamperedJWT}>
                    Fecth with tampered JWT
                </button>
            </>
        ): (
            <button onClick={signIn}>
                Sign in with Ethereum
            </button>
        ) }

        { secret && `Secret: ${ secret }` }
        { error && `Error: ${ error }` }
    </div>
  )
}
