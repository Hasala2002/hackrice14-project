const socket = io();
let stream;

$(document).ready(function () {
  const video = document.getElementById("videoElement");
  const canvas = document.getElementById("canvasElement");
  const ctx = canvas.getContext("2d");
  const videoToggle = $("#videoToggle");
  let stream;
  let isVideoOn = false;
  let ws;

  function sendFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    socket.emit("stream", canvas.toDataURL("image/webp"));
  }

  setInterval(sendFrame, 1);

  async function startVideo() {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing the camera", err);
        });
      videoElement.srcObject = stream;
      isVideoOn = true;
      videoToggle.find("ion-icon").attr("name", "videocam-off");
      // sendVideoFrames();
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

  videoToggle.click(function () {
    if (isVideoOn) {
      stopVideo();
    } else {
      startVideo();
    }
  });

  // Start with video off
  stopVideo();
  // connectWebSocket();
});
