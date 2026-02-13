import "./Vid.css";

export default function Vid() {
  return (
    <video
      className="video-bg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src="/bg.mp4" type="video/mp4" />
    </video>
  );
}
