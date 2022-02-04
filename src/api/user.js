import { getLoginSession } from 'lib/auth'
import { findUserByID, updateUserHandle } from 'lib/fauna'

export default async function user(req, res) {
  try {
    // console.log('inuser function')
    const session = await getLoginSession(req, 'auth_cookie_name')
    // console.log('session', session)

    let data
    switch (req.method) {
      case 'GET': {
        const fRes = await findUserByID(session.userId, session.accessToken)
        data = fRes.findUserByID
        break
      }
      case 'PUT': {
        const fRes = await updateUserHandle(session.userId, req.body.handle, session.accessToken)
        data = fRes.updateUserHandle
        break
      }
    }

    res.status(200).json(data)
  } catch (e) {
    console.log('user function err', e)
    res.status(400).send()
  }
}
