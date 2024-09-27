"use client";
import { useEffect, useRef } from "react";
import { detectEyes } from "./libs/detectEyeUtiles";
import * as tf from '@tensorflow/tfjs';
import FaceMeshTracker from "./components/FaceMeshTracker";
import * as facemesh from "@tensorflow-models/facemesh";

export const loadModel = async () => {
  tf.setBackend("webgl")
  return await facemesh.load();
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

// イベント発火関数
const startEyeTracking = async () => {
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      // 'loadeddata'イベントが発火した後に処理を実行
      videoRef.current.addEventListener('loadeddata', async () => {
        videoRef.current.play();
        const model  = await loadModel();
        // 目線検出を開始
        await detectEyes(videoRef.current, model);
      });
    }
  } catch (err) {
    console.error("カメラへのアクセスに失敗しました", err);
  }
};



  useEffect(() => {
    (async () => {
        
      await startEyeTracking();
    })();
  },[])
  return     <div>
  <video ref={videoRef} autoPlay playsInline />
</div>;
}