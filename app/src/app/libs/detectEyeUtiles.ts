import * as facemesh from "@tensorflow-models/facemesh";

// 目の中心を計算
export const calculateEyeCenter = (
  eye: number[][]
): { x: number; y: number } => {
  const x = eye.reduce((sum, point) => sum + point[0], 0) / eye.length;
  const y = eye.reduce((sum, point) => sum + point[1], 0) / eye.length;
  return { x, y };
};

// 目線の方向がカメラの中心に向いているかどうかの判定
function isLookingAtCamera(
  leftEyeCenter: { x: number; y: number },
  rightEyeCenter: { x: number; y: number },
  video: HTMLVideoElement
): boolean {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  // カメラ（画面）中央の座標
  const centerX = videoWidth / 2;
  const centerY = videoHeight / 2;

  // 目の中心位置がカメラ中央付近かどうかを判定
  const threshold = 50; // カメラの中心からどのくらいの範囲で目が合っているとみなすかの閾値
  const leftEyeDistanceX = Math.abs(leftEyeCenter.x - centerX);
  const leftEyeDistanceY = Math.abs(leftEyeCenter.y - centerY);
  const rightEyeDistanceX = Math.abs(rightEyeCenter.x - centerX);
  const rightEyeDistanceY = Math.abs(rightEyeCenter.y - centerY);

  return (
    leftEyeDistanceX < threshold &&
    leftEyeDistanceY < threshold &&
    rightEyeDistanceX < threshold &&
    rightEyeDistanceY < threshold
  );
}

// 目線の方向がカメラの中心に向いているかどうかの判定
// export const isLookingInSpecificDirection = (
//   leftEyeCenter: { x: number; y: number },
//   rightEyeCenter: { x: number; y: number }
// ): boolean => {
//   const thresholdX = 100; // 画面中央からのX座標の閾値
//   const thresholdY = 50; // 画面中央からのY座標の閾値

//   // 目の中心がどの程度中央から離れているかを確認
//   return (
//     Math.abs(leftEyeCenter.x - rightEyeCenter.x) > thresholdX ||
//     Math.abs(leftEyeCenter.y - rightEyeCenter.y) > thresholdY
//   );
// };

// 目線検出処理
export const detectEyes = async (video: HTMLVideoElement, model: any) => {
  // const model = await facemesh.load();
  if(!video) return;

  // 再起的に処理を実行
  const detect = async () => {
    const predictions: facemesh.AnnotatedPrediction[] =
      await model.estimateFaces(video);
    if (predictions.length > 0) {
      // 目の位置を取得
      // FIXME 型修正
      const keypoints = predictions[0].scaledMesh as number[][];// 3次元座標が格納された配列

      console.log(keypoints);

      // 左右の目の座標を取得（例: 目の位置は468〜473の間）
      // console.log(keypoints)
      // const leftEye = keypoints.slice(468, 473);
      // const rightEye = keypoints.slice(473, 478);
      // const leftEye = leftEyeIndices.map(index => keypoints[index]);
      // const rightEye = rightEyeIndices.map(index => keypoints[index]);

          // 左右の目に対応するランドマークインデックス
    const leftEyeIndices = [468, 469, 470, 471, 472];
    const rightEyeIndices = [473, 474, 475, 476, 477];



    const leftEye = leftEyeIndices.map(index => {
      if (keypoints[index]) {
        return keypoints[index];
      } else {
        console.error(`インデックス ${index} に対応するランドマークが見つかりません`);
        return [0, 0, 0]; // デフォルト値を設定
      }
    });

    const rightEye = rightEyeIndices.map(index => {
      if (keypoints[index]) {
        return keypoints[index];
      } else {
        console.error(`インデックス ${index} に対応するランドマークが見つかりません`);
        return [0, 0, 0]; // デフォルト値を設定
      }
    });

      // 目の中心位置を計算
      const leftEyeCenter = calculateEyeCenter(leftEye);
      const rightEyeCenter = calculateEyeCenter(rightEye);

      console.log(leftEyeCenter);
      console.log(rightEyeCenter);
      if (isLookingAtCamera(leftEyeCenter, rightEyeCenter, video)) {
        console.log("目線がカメラと合いました！");
        // イベントを発火
        alert("目線がカメラと合いました！");
      }

      // 条件に基づいてプログラムを発火
      //   if (isLookingInSpecificDirection(leftEyeCenter, rightEyeCenter)) {
      //     console.log("目線がカメラと合いました！");
      //     // プログラムを発火
      //   }
    }
    // フレームごとに繰り返し検出を行う
    // requestAnimationFrame(detect);
  };

  await detect();
};
