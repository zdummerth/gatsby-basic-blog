import React, { useState } from 'react'
import LoginForm from 'components/LoginForm';
import { Magic } from 'magic-sdk'
import Layout from 'components/Layout'

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
      // const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
      // const didToken = await magic.auth.loginWithMagicLink({
      //   email: body.email,
      // })

      const didToken = 'jj'

      const res = await fetch('/api/auth/login', {
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
      <Layout pageTitle="Login">

        <div className="std-div alt-bg w-100 mt-s">
          <LoginForm errorMessage={errorMsg} onSubmit={handleSubmit} loading={loading} />
        </div>
      </Layout>
    </>
  )
}

export default Login

