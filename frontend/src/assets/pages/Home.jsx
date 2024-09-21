import { Button, Container, Text } from "@mantine/core"
import { useAuth } from "../utilities/Auth.Context"

const Home = () => {

    const {user, logout} = useAuth()
    

  return (
    <Container h="100%" display="flex" style={{justifyContent:"center", alignItems:"center", flexDirection: "column"}} ta="left">
        <Text>User Logged In: {user.name}</Text>
        {/* <Button mx="auto" onClick={logout}>Logout</Button> */}
        <Button mx="auto" onClick={()=>{logout({ logoutParams: { returnTo: "http://localhost:5173/login" } })}}>Logout</Button>
    </Container>
  )
}

export default Home