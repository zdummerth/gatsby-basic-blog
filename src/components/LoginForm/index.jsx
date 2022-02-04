import React, { useState } from 'react'
import { Magic } from 'magic-sdk'
import { navigate } from "@reach/router"



const Login = () => {

    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (errorMsg) setErrorMsg('')

        const body = {
            email: e.currentTarget.email.value,
        }

        try {
            setLoading(true)
            const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
            const didToken = await magic.auth.loginWithMagicLink({
                email: body.email,
            })

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + didToken,
                },
                body: JSON.stringify(body),
            })
            if (res.status === 200) {
                const userData = await res.json()
                console.log('user', userData)
                // navigate(`/app/profile`)
            } else {
                throw new Error()
            }
        } catch (error) {
            console.error('An unexpected error happened occurred:', error)
            setLoading(false)
            setErrorMsg(error.message)
        }
    }

    return (
        <>
            <div className="std-div alt-bg w-100 mt-s">
                <form onSubmit={handleSubmit}>
                    <label>
                        <div className="mb-s">email</div>
                        <input type="email" name="email" required />
                    </label>

                    <button className='border std-div bg' type="submit" disabled={loading}>
                        sign Up / login
                    </button>
                    {loading && <>loading</>}

                    {errorMsg && <p className="error">{errorMsg}</p>}

                </form>
            </div>
        </>
    )
}

export default Login

