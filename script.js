const APP_ID = "YOUR_AGORA_APP_ID"; // استبدل بـ App ID الخاص بك
const CHANNEL_NAME = "test_channel"; // اسم القناة
const TOKEN = "YOUR_AGORA_TOKEN"; // استبدل بـ التوكين الخاص بك

let client, localStream;

document.getElementById("start-btn").onclick = async () => {
  // إنشاء عميل Agora
  client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  
  // الانضمام إلى القناة
  await client.init(APP_ID);
  console.log("AgoraRTC client initialized");
  await client.join(TOKEN, CHANNEL_NAME, null, (uid) => {
    console.log("User " + uid + " joined channel");
  });

  // إنشاء الفيديو المحلي
  localStream = AgoraRTC.createStream({
    video: true,
    audio: true,
  });
  await localStream.init();
  console.log("Local stream initialized");

  // تشغيل الفيديو
  localStream.play("video-stream");
  client.publish(localStream, (err) => console.error(err));

  // تفعيل زر الإنهاء
  document.getElementById("end-btn").disabled = false;
  document.getElementById("start-btn").disabled = true;
};

document.getElementById("end-btn").onclick = async () => {
  localStream.stop();
  localStream.close();
  await client.leave();
  console.log("Left the channel");

  document.getElementById("start-btn").disabled = false;
  document.getElementById("end-btn").disabled = true;
};
