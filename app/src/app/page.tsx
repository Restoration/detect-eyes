"use client";
import { useEffect, useRef } from "react";
import { detectEyes } from "./libs/detectEyeUtiles";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const detectEvent = async () => {
      if (!videoRef.current) return;
      tf.setBackend("webgl");
      const model = await facemesh.load();
      // 目線検出を開始
      await detectEyes(videoRef.current, model);
    };
    (async () => {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef && videoRef.current) {
          videoRef.current.srcObject = stream;

          // 'loadeddata'イベントが発火した後に処理を実行
          videoRef.current.addEventListener("loadeddata", detectEvent);
        }
      } catch (err) {
        console.error("カメラへのアクセスに失敗しました", err);
      }
    })();
    return () => {
      videoRef.current?.removeEventListener("loadeddata", detectEvent);
    };
  }, [videoRef.current]);
  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        // video要素は残したまま非表示にしている
        // 内部でvideo要素のサイズを利用しているためvisibilityで非表示
        style={{ visibility: "hidden" }}
      />
    </div>
  );
}
