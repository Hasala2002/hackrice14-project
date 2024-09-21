import { Container } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const LiveClass = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

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
      h="100%"
      display="flex"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      ta="left"
    >
      <h2>Live Feed</h2>
      <canvas
        ref={videoRef}
        width="640"
        height="480"
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
    </Container>
  );
};

export default LiveClass;
