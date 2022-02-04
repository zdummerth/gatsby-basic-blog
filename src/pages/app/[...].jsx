import React from "react"
import { Router } from "@reach/router"
import Layout from "components/Layout"
import Profile from "components/Profile"
import Details from "components/Details"
import PrivateRoute from "components/PrivateRoute"

const App = () => (
    <Layout>
        <Router>
            <PrivateRoute path="/app/details" component={Details} />
            <PrivateRoute path="/app/profile" component={Profile} />
        </Router>
    </Layout>
)

export default App
