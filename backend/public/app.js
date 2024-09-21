$(document).ready(function () {
  const videoElement = document.getElementById("videoElement");
  const canvasElement = document.getElementById("canvasElement");
  const videoToggle = $("#videoToggle");
  let stream;
  let isVideoOn = false;
  let ws;

  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setTimeout(connectWebSocket, 1000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  async function startVideo() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      isVideoOn = true;
      videoToggle.find("ion-icon").attr("name", "videocam-off");
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  }

  function stopVideo() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    videoElement.srcObject = null;
    isVideoOn = false;
    videoToggle.find("ion-icon").attr("name", "videocam");
  }

  function sendVideoFrames() {
    if (!isVideoOn) return;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasElement.getContext("2d").drawImage(videoElement, 0, 0);

    const imageData = canvasElement.toDataURL("image/jpeg", 0.5);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(imageData);
    }

    requestAnimationFrame(sendVideoFrames);
  }

  videoToggle.click(function () {
    if (isVideoOn) {
      stopVideo();
    } else {
      startVideo();
    }
  });

  stopVideo();
  connectWebSocket();
});
