# Tensorflow を利用したカメラへの目線認識処理の検証リポジトリ

```
$ npm i
$ npm run dev
```

### カメラ目線の認識処理の考え方

---

このコードは、カメラ映像から目の位置をリアルタイムで取得し、目線がカメラの中心に向いているかを判断する処理を行う。

1. 目のランドマーク検出: facemesh モデルを使って、顔のランドマークを取得。
1. 目の中心位置計算: 左右の目の中心位置を計算。
1. 目線の判定: 目線がカメラの中心に向いているかどうかを判定し、結果を通知する。

この処理をリアルタイムで繰り返すことで、常に目線の状態を追跡し続けることが可能。

### Facemesh のランドマークマッピング

---

Facemesh では顔の 468 個のランドマークが使用されており、これらのランドマークは、顔の特定の部位（目、鼻、口、輪郭など）に対応しています。

- https://github.com/google-ai-edge/mediapipe/issues/1909

### 注意点

---

`TypeError: info.backend.decComplexRef is not a function`というエラーは、TensorFlow.js のバックエンドの初期化や動作に関連する問題が原因です。このエラーは、Next.js でサーバーサイドとクライアントサイドの実行環境が混在しているために発生することが多いです。

```

export const loadModel = async () => {
  tf.setBackend("webgl")
  return await facemesh.load();
};
```

tf.setBackend で webgl の値をセットする必要がある  
next.js はサーバーも動いていることもあって、パッケージエラーが頻発するため相性がよくない印象  
また、依存関係系が諸々でてくるので取り扱いに注意が必要。

web-camera などのコンポーネントパッケージを利用しても良さそうだが、柔軟性があるのはスクラッチなのでそちらで進めるのが良さそう。

### 参考資料

---

- https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/face_mesh.md
