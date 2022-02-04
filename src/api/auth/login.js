import { magic } from 'lib/magicAdmin'
import { setLoginSession, getLoginSession } from 'lib/auth'
import { getTokenCookie } from 'lib/auth-cookies'
import { login } from 'lib/fauna';
/**
 * Use Magic to validate the DID token sent in the Autorization header
 * Create JWT containing info about the user
 * Set it inside a cookie, which will be automatically sent on subsequent requests to our server
 * Return the user data to frontend
 */
export default async function loginHandler(req, res) {
  console.log('in login function', req.body)
  try {
    // const didToken = req.headers.authorization.substr(7);

    // await magic.token.validate(didToken);

    // const metadata = await magic.users.getMetadataByToken(didToken);
    // console.log("metadata", metadata)

    // //get user and access code from db and set access code as session
    // const user = await login(req.body.email, process.env.FAUNA_SERVER_KEY)
    // console.log('user res', user)
    // const session = { ...metadata, ...user }

    // await setLoginSession(res, session, 'auth_cookie_name');

    // res.status(200).json({
    //   email: session.email,
    //   faunaId: session.id,
    // });

    res.status(200).json({
        email: '',
        faunaId: '',
      });

    // res.status(200).send({ user: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
