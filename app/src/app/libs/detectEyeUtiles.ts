import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import { Coords3D } from "@tensorflow-models/facemesh/dist/util";

export const calculateEyeCenter = (
  eye: number[][]
): { x: number; y: number } => {
  const x = eye.reduce((sum, point) => sum + point[0], 0) / eye.length;
  const y = eye.reduce((sum, point) => sum + point[1], 0) / eye.length;
  return { x, y };
};

export const isLookingInSpecificDirection = (
  leftEyeCenter: { x: number; y: number },
  rightEyeCenter: { x: number; y: number }
): boolean => {
  const thresholdX = 100; // 画面中央からのX座標の閾値
  const thresholdY = 50; // 画面中央からのY座標の閾値

  // 目の中心がどの程度中央から離れているかを確認
  return (
    Math.abs(leftEyeCenter.x - rightEyeCenter.x) > thresholdX ||
    Math.abs(leftEyeCenter.y - rightEyeCenter.y) > thresholdY
  );
};

// 目線検出処理
export const detectEyes = async (video: HTMLVideoElement) => {
  const model = await facemesh.load();

  // 再起的に処理を実行
  const detect = async () => {
    const predictions: facemesh.AnnotatedPrediction[] = await model.estimateFaces(video);
    if (predictions.length > 0) {
      // 目の位置を取得
      const keypoints = predictions[0].scaledMesh;

      console.log(keypoints);

      // 左右の目の座標を取得（例: 目の位置は468〜473の間）
      const leftEye = keypoints.slice(468, 473);
      const rightEye = keypoints.slice(473, 478);

      // 目の中心位置を計算
      const leftEyeCenter = calculateEyeCenter(leftEye);
      const rightEyeCenter = calculateEyeCenter(rightEye);

      // 条件に基づいてプログラムを発火
      if (isLookingInSpecificDirection(leftEyeCenter, rightEyeCenter)) {
        console.log("特定の方向を見ている");
        // プログラムを発火
      }
    }
    requestAnimationFrame(detect);
  };

  detect();
};

// イベント発火関数
export const startEyeTracking = async () => {
  const video = document.createElement("video");
  document.body.appendChild(video);

  try {
    // ブラウザのカメラ起動
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    // 目線検出を開始
    await detectEyes(video);
  } catch (err) {
    console.error("カメラへのアクセスに失敗しました", err);
  }
};
