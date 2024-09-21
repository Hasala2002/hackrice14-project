import { useAuth0 } from '@auth0/auth0-react';
import { Card, Image, Text, Button, Group, Container} from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const { loginWithRedirect, user } = useAuth0();
    const navigate = useNavigate();

    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[user, navigate])

  return (
    <Container h="100%" display="flex" style={{placeItems:"center"}} ta="left">
        <Card shadow="sm" padding="lg" radius="md" withBorder w="500" mx="auto">
      <Card.Section>
        <Image
          src="https://tse1.mm.bing.net/th?id=OIG2.n8oSieKoi6xqMOVzhTN_&pid=ImgGn"
          height={160}
          alt="LMS"
        />
      </Card.Section>

        <Text fw={500} ta="center" my="sm">Authention Provided By</Text>
    <Image
      radius="md"
      ta="center"
      mx="auto"
      w={100}
      h="auto"
      fit="contain"
      src="https://pages.okta.com/rs/855-QAH-699/images/email-main-template_auth0-by-okta-logo_black_279x127_3x.png"
    />


      <Group mt="md">
        <Button w="100%" onClick={loginWithRedirect}>Login</Button>
      </Group>
    </Card>
    </Container>
  )
}

export default Login