import { SSXServer, SSXExpressMiddleware, SSXAuthenticationMethod } from '@spruceid/ssx-server'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { verify } from 'jsonwebtoken'

/** Ideally this should live on .env file */
const MY_SECRET_KEY = 'FAKESECRET'
const app = express()
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' 
}))
const ssx = new SSXServer({
    signingKey: MY_SECRET_KEY,
    authenticationMethod: SSXAuthenticationMethod.JWT,
})
app.use(SSXExpressMiddleware(ssx))

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const jwt = req.headers.authorization.split(' ')[1]

    if (!jwt)
        res.status(403).json({ message: 'Unauthorized' })

    try {
        /** If the token is valid, it'll be decrypted to the payload encrypted by SSX */
        const payload = verify(jwt, MY_SECRET_KEY)
        next()
    } catch (error) {
        /** Otherwise, it'll throw */
        res.status(403).json({ message: 'Invalid JWT' })
    }
}

const privateRouteHandler = ( _: Request, res: Response) => {
    res.status(200).json({ secret: 'shhhh' })
}

app.get('/private-route',
    authMiddleware,
    privateRouteHandler,
)

app.listen(8000, () => console.log('Listening...'))
