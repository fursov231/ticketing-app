import buildClient from "../api/build-client"


const LandingPage = ({currentUser}) => {
    return currentUser ? <h1>You are sign in</h1> : <h1>You are not sign in</h1>

    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async (context) => { //для получения данных для отрисовки
    console.log("Landing page")
    const client = buildClient(context)
    const {data} = await client.get("/api/users/currentuser")
    return data
}


export default LandingPage