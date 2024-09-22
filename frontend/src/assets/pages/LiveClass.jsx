import { Button, Container } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../utilities/Auth.Context";

const LiveClass = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const { setCollided } = useAuth();

  useEffect(() => {
    socketRef.current = io("http://localhost:3000"); // Replace with your server URL

    socketRef.current.on("stream", (imageData) => {
      const img = new Image();
      img.onload = () => {
        const canvas = videoRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = imageData;
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Container
      // h="100%"
      mt="xl"
      display="flex"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      ta="left"
    >
      <h2>Live Class</h2>
      <canvas
        ref={videoRef}
        width="480"
        height="320"
        style={{ backgroundColor: "#242424" }}
      />
      {/* {isConnected ? (
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{ backgroundColor: "#242424" }}
        />
      ) : (
        <p>Connecting to live feed...</p>
      )} */}
      <Button
        m="sm"
        color="red"
        onClick={() => {
          setCollided(false);
        }}
      >
        Leave Class
      </Button>
    </Container>
  );
};

export default LiveClass;
