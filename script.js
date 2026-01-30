import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });
const video = document.getElementById("videoPlayer");
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Load FFmpeg
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  // Write MKV file to FFmpeg FS
  ffmpeg.FS("writeFile", "input.mkv", await fetchFile(file));

  // Convert MKV → MP4 (H.264 + AAC)
  await ffmpeg.run("-i", "input.mkv", "-c:v", "libx264", "-c:a", "aac", "output.mp4");

  // Read converted MP4
  const data = ffmpeg.FS("readFile", "output.mp4");

  // Create a blob URL for the video element
  const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
  video.src = URL.createObjectURL(videoBlob);
  video.play();
});
