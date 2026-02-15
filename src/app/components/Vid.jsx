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
      <source src="https://res.cloudinary.com/dts9wynrs/video/upload/v1771158136/bg_otqn8j.mp4" type="video/mp4" />
    </video>
  );
}
