import jwt from 'jsonwebtoken'
import Iron from '@hapi/iron'


import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies'
const { JWT_SIGNATURE_KEY_COOKIE, JWT_ENCRYPTION_KEY_COOKIE } = process.env


export async function setLoginSession(res, session, tokenName) {
  const createdAt = Date.now()
  // Create a session object with a max age that we can validate later
  const payload = { ...session, createdAt, maxAge: MAX_AGE }

  const signed = jwt.sign(payload, JWT_SIGNATURE_KEY_COOKIE)
  const encrypted = await Iron.seal(signed, JWT_ENCRYPTION_KEY_COOKIE, Iron.defaults)

  setTokenCookie(res, encrypted, tokenName)
}

export async function getLoginSession(req, tokenName) {

  const token = getTokenCookie(req, tokenName)

  if (!token) throw 'Token Not Found'

  const decrypted = await Iron.unseal(token, JWT_ENCRYPTION_KEY_COOKIE, Iron.defaults)
  const payload = jwt.verify(decrypted, JWT_SIGNATURE_KEY_COOKIE)
  const expiresAt = payload.createdAt + payload.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  return payload
}
