/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */

import {
  Accordion,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { useAuth } from "../utilities/Auth.Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  addResponseMessage,
  toggleMsgLoader,
  Widget,
} from "@ryaneewx/react-chat-widget";

import "@ryaneewx/react-chat-widget/lib/styles.css";

import { css, Global } from "@emotion/react";
import React from "react";
import AssetLoader from "../../@core/AssetLoader";
import Game from "../../@core/Game";
import Scene from "../../@core/Scene";
import SceneManager from "../../@core/SceneManager";
import useWindowSize from "../../@core/useWindowSize";
import OfficeScene from "../scenes/OfficeScene";
import OtherScene from "../scenes/OtherScene";
import soundData from "../../soundData";
import spriteData from "../../spriteData";
import globalStyles from "../styles/global";
import LiveClass from "./LiveClass";

const styles = {
  root: (width, height) => css`
    display: flex;
    width: ${width - (width % 2)}px;
    height: ${height - (height % 2)}px;
    justify-content: center;
    align-items: center;
  `,
};

const urls = [
  ...Object.values(spriteData).map((data) => data.src),
  ...Object.values(soundData).map((data) => data.src),
  // flatten
].reduce((acc, val) => acc.concat(val), []);

const assignments = [
  {
    emoji: "✅",
    value: "Assignment #1",
    description:
      "Write a two-paragraph biography introducing yourself. Include your hobbies, interests, and future career goals.",
  },
  {
    emoji: "🏁",
    value: "Assignment #2",
    description:
      "Review the provided vocabulary list and complete the quiz. You must score at least 80% to pass.",
  },
  {
    emoji: "🏁",
    value: "Assignment #3",
    description:
      "Post your thoughts on the importance of teamwork in the workplace. Reply to at least two classmates' posts by the end of the week.",
  },
];

const items = assignments.map((item) => (
  <Accordion.Item key={item.value} value={item.value}>
    <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
    <Accordion.Panel ta="left">
      <Text>{item.description}</Text>
      <Button mt="md">Submit Assignment</Button>
    </Accordion.Panel>
  </Accordion.Item>
));

function Classroom() {
  const { user, logout, collided, setCollidedAssign, collidedAssign } =
    useAuth();
  const [width, height] = useWindowSize();

  const fetchData = async (query) => {
    try {
      const response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      addResponseMessage(result[0].message.content);
      toggleMsgLoader();
      // setData(result);
    } catch (error) {
      // setError(error.message);
      toggleMsgLoader();
    }
  };

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // addResponseMessage("hello there");
    toggleMsgLoader();
    fetchData(newMessage);
    // Now send the message throught the backend API
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          gap: "10px",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Card shadow="sm" padding="lg" radius="xs" withBorder w="500">
            <Avatar
              ta="center"
              mx="auto"
              alt={user.name}
              variant="filled"
              radius="lg"
              size="lg"
              style={{ height: "55px !important" }}
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
              {/* <Button component={Link} to="/classroom">
                Go To Classroom
              </Button> */}
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
          {collidedAssign && (
            <Card shadow="sm" padding="lg" radius="xs" withBorder w="500">
              <Accordion>{items}</Accordion>

              <Button
                m="sm"
                color="red"
                onClick={() => {
                  setCollidedAssign(false);
                }}
              >
                Close Assignments
              </Button>
            </Card>
          )}
          {collided && <LiveClass />}
        </div>
        <Global styles={globalStyles} />
        <div
          style={{
            flex: 1,
            height: "100%",
            display: "grid",
            placeItems: "center",
            backgroundColor: "#989489",
          }}
        >
          <Game cameraZoom={80}>
            <AssetLoader urls={urls} placeholder="Loading assets ...">
              <SceneManager defaultScene="office">
                <Scene id="office">
                  <OfficeScene />
                </Scene>
                <Scene id="other">
                  <OtherScene />
                </Scene>
              </SceneManager>
            </AssetLoader>
          </Game>
        </div>
      </div>
      <Widget
        title="Cyberswift Mentor"
        subtitle="Let me help you with your work!"
        handleNewUserMessage={handleNewUserMessage}
      />
    </>
  );
}
export default Classroom;
