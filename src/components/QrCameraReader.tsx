import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, CameraOff, LoaderCircle } from "lucide-react";

interface QrCameraReaderProps {
  onDetected: (value: string) => void;
}

interface DetectedBarcode {
  rawValue: string;
}

interface BarcodeDetectorInstance {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
}

export function QrCameraReader({ onDetected }: QrCameraReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const [state, setState] = useState<"idle" | "starting" | "scanning" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  function stop() {
    if (loopRef.current !== null) {
      window.clearInterval(loopRef.current);
      loopRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => stop, []);

  async function start() {
    setState("starting");
    setError("");
    finishedRef.current = false;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("当前浏览器不支持相机扫描");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("视频组件不可用");
      video.srcObject = stream;
      await video.play();
      setState("scanning");

      const detectorConstructor = (
        window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }
      ).BarcodeDetector;
      const detector = detectorConstructor
        ? new detectorConstructor({ formats: ["qr_code"] })
        : null;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      loopRef.current = window.setInterval(() => {
        if (finishedRef.current) return;
        if (!video.videoWidth || !video.videoHeight) return;
        if (detector) {
          void detector.detect(video).then((codes) => {
            if (codes[0]?.rawValue && !finishedRef.current) {
              finishedRef.current = true;
              onDetected(codes[0].rawValue);
            }
          });
          return;
        }
        if (!context) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(image.data, image.width, image.height, {
          inversionAttempts: "dontInvert",
        });
        if (result?.data && !finishedRef.current) {
          finishedRef.current = true;
          onDetected(result.data);
        }
      }, 320);
    } catch (reason) {
      stop();
      setState("error");
      setError(
        reason instanceof Error
          ? reason.name === "NotAllowedError"
            ? "相机权限被拒绝，请允许访问或手动输入动物编号。"
            : reason.message
          : "相机启动失败，请手动输入动物编号。",
      );
    }
  }

  return (
    <div className="qr-camera-reader">
      <div className={`qr-video-frame state-${state}`}>
        <video ref={videoRef} muted playsInline aria-label="二维码扫描画面" />
        {state !== "scanning" && (
          <div className="qr-camera-placeholder">
            {state === "starting" ? (
              <LoaderCircle className="is-spinning" size={30} aria-hidden="true" />
            ) : state === "error" ? (
              <CameraOff size={32} aria-hidden="true" />
            ) : (
              <Camera size={34} aria-hidden="true" />
            )}
            <strong>
              {state === "starting"
                ? "正在打开相机"
                : state === "error"
                  ? "无法使用相机"
                  : "扫描园区动物二维码"}
            </strong>
            <span>{error || "相机只用于识别动物入口，不会保存画面。"}</span>
          </div>
        )}
        <span className="qr-scan-corners" aria-hidden="true" />
      </div>
      {state !== "scanning" && (
        <button
          type="button"
          className="primary-large-button"
          onClick={() => void start()}
        >
          <Camera size={18} aria-hidden="true" />
          开启相机扫码
        </button>
      )}
      {state === "scanning" && (
        <button type="button" className="scanner-stop-button" onClick={() => { stop(); setState("idle"); }}>
          停止相机
        </button>
      )}
    </div>
  );
}
