import React from "react"
import View from "./View"

const Details = () => {
    //use user

    const user = {
        handle: ''
    }
    return (
        <View title="Your Details">
            <p>
                This is a client-only route. You can get additional information about a
                user on the client from this page.
            </p>
            <ul>
                <li>handle: {user.handle}</li>
            </ul>
        </View>
    )
}

export default Details
