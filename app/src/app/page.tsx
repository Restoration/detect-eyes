"use client";
import { useEffect } from "react";
import { startEyeTracking } from "./libs/detectEyeUtiles";

export default function Home() {
  useEffect(() => {
    (async () => {
      await startEyeTracking();
    })();
  }, []);
  return <></>;
}
