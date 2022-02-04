import React from "react"
import View from "./View"

const Profile = () => {
    //use User

    const user = {
        name: ''
    }
    return (
        <View title="Your Profile">
            <p>Welcome back to your profile, {user.name}!</p>
            <p>
                This is a client-only route. You could set up a form to save information
                about a user here.
            </p>
        </View>
    )
}

export default Profile
