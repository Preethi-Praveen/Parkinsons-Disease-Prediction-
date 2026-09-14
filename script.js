let mediaRecorder=null, chunks=[], startTime=null, timerInterval=null, stream=null;
const recordBtn=document.getElementById("recordBtn");
const resetBtn=document.getElementById("resetBtn");
const analyzeBtn=document.getElementById("analyzeBtn");
const timer=document.getElementById("timer");
const statusText=document.getElementById("statusText");
const statusDot=document.getElementById("statusDot");
const waveBox=document.getElementById("waveBox");
const audioPlayer=document.getElementById("audioPlayer");
const toast=document.getElementById("toast");

function showToast(message){
  toast.textContent=message; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
function formatTime(seconds){
  const m=String(Math.floor(seconds/60)).padStart(2,"0");
  const s=String(seconds%60).padStart(2,"0");
  return `${m}:${s}`;
}
async function startRecording(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    showToast("Microphone access is not supported in this browser.");
    return;
  }
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:true});
    chunks=[];
    mediaRecorder=new MediaRecorder(stream);
    mediaRecorder.ondataavailable=e=>{if(e.data.size) chunks.push(e.data)};
    mediaRecorder.onstop=()=>{
      const blob=new Blob(chunks,{type:"audio/webm"});
      audioPlayer.src=URL.createObjectURL(blob);
      audioPlayer.hidden=false;
      if(stream) stream.getTracks().forEach(t=>t.stop());
      statusText.textContent="Recording captured";
      statusDot.classList.remove("recording");
      waveBox.classList.remove("recording");
      recordBtn.classList.remove("recording");
      recordBtn.innerHTML="<span>●</span> Start Recording";
      clearInterval(timerInterval);
    };
    mediaRecorder.start();
    startTime=Date.now();
    timerInterval=setInterval(()=>timer.textContent=formatTime(Math.floor((Date.now()-startTime)/1000)),500);
    statusText.textContent="Recording in progress";
    statusDot.classList.add("recording");
    waveBox.classList.add("recording");
    recordBtn.classList.add("recording");
    recordBtn.innerHTML="<span>■</span> Stop Recording";
    showToast("Recording started.");
  }catch(err){
    showToast("Microphone permission was not granted.");
  }
}
function stopRecording(){
  if(mediaRecorder && mediaRecorder.state!=="inactive") mediaRecorder.stop();
}
recordBtn.addEventListener("click",()=>{
  if(mediaRecorder && mediaRecorder.state==="recording") stopRecording();
  else startRecording();
});
resetBtn.addEventListener("click",()=>{
  if(mediaRecorder && mediaRecorder.state==="recording") mediaRecorder.stop();
  timer.textContent="00:00"; statusText.textContent="Ready for recording";
  statusDot.classList.remove("recording"); waveBox.classList.remove("recording");
  recordBtn.classList.remove("recording"); recordBtn.innerHTML="<span>●</span> Start Recording";
  audioPlayer.hidden=true; audioPlayer.removeAttribute("src");
  document.getElementById("prediction").textContent="Awaiting sample";
  document.getElementById("confidenceText").textContent="—";
  document.getElementById("confidenceBar").style.width="0";
});
analyzeBtn.addEventListener("click",()=>{
  analyzeBtn.disabled=true; analyzeBtn.textContent="Analyzing…";
  const steps=[...document.querySelectorAll(".pipeline-step")];
  steps.forEach(s=>s.classList.remove("active"));
  let i=0;
  const interval=setInterval(()=>{
    if(i<steps.length){steps[i].classList.add("active");i++}
    else{
      clearInterval(interval);
      document.getElementById("prediction").textContent="Demo: Elevated Risk";
      document.getElementById("confidenceText").textContent="86%";
      document.getElementById("confidenceBar").style.width="86%";
      document.getElementById("predictionNote").textContent="Demonstration result only — connect your trained model before using for research evaluation.";
      analyzeBtn.disabled=false; analyzeBtn.textContent="Analyze Voice Sample →";
      showToast("Demo analysis completed.");
    }
  },420);
});
