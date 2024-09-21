import { Avatar, Button, Card, Container, Group, Text } from "@mantine/core";
import { useAuth } from "../utilities/Auth.Context";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const { user, logout } = useAuth();

  const testFunc = async (studentData) => {
    try {
      // Make a POST request to your Node.js server
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      // Get the response from the server
      const result = await response.json();

      // Handle success or error
      if (response.ok) {
        console.log(`Student added successfully! ID: ${result.studentId}`);
      } else {
        console.log(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Failed to add student");
    }
  };

  useEffect(() => {
    testFunc({
      id: user.sub,
      name: user.name,
      email: user.email,
    });
  }, []);

  return (
    <Container
      h="100%"
      display="flex"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      ta="left"
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder w="500" mx="auto">
        <Avatar
          ta="center"
          mx="auto"
          alt={user.name}
          variant="filled"
          radius="lg"
          size="lg"
          src={user.picture}
        />
        <Text ta="center" fw={700}>
          {user.name}
        </Text>
        <Text ta="center" mb="xl">
          {user.email}
        </Text>
        {/* <Button mx="auto" onClick={logout}>Logout</Button> */}
        <Group mt="md" display="flex" justify="center">
          <Button component={Link} to="/classroom">
            Go To Classroom
          </Button>
          <Button
            mx="sm"
            color="red"
            onClick={() => {
              logout({
                logoutParams: { returnTo: "http://localhost:5173/login" },
              });
            }}
          >
            Logout
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Home;
