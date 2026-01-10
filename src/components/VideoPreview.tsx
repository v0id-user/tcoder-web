interface VideoPreviewProps {
  src: string;
  controls?: boolean;
  muted?: boolean;
  className?: string;
}

export function VideoPreview({ 
  src, 
  controls = false, 
  muted = false,
  className = ""
}: VideoPreviewProps) {
  return (
    <video
      src={src}
      controls={controls}
      muted={muted}
      className={`w-full max-w-md aspect-video bg-black border border-gray-200 ${className}`}
    />
  );
}
