# Tensorflowを利用したカメラへの目線認識処理の検証リポジトリ

```
$ npm run dev
```




### 注意点
---

`TypeError: info.backend.decComplexRef is not a function`というエラーは、TensorFlow.jsのバックエンドの初期化や動作に関連する問題が原因です。このエラーは、Next.jsでサーバーサイドとクライアントサイドの実行環境が混在しているために発生することが多いです。


```

export const loadModel = async () => {
  tf.setBackend("webgl")
  return await facemesh.load();
};
```

tf.setBackendでwebglの値をセットする必要がある  
next.jsはサーバーも動いていることもあって、パッケージエラーが頻発するため相性がよくない印象  
また、依存関係系が諸々でてくるので取り扱いに注意が必要。

web-cameraなどのコンポーネントパッケージを利用しても良さそうだが、柔軟性があるのはスクラッチなのでそちらで進めるのが良さそう。