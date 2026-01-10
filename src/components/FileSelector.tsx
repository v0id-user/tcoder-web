interface FileSelectorProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  error?: string | null;
}

export function FileSelector({ onFileSelect, disabled, error }: FileSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Disclaimer */}
      <div className="flex flex-col items-center gap-2 max-w-sm text-center">
        <p className="text-[0.65rem] font-mono text-red-500 uppercase tracking-wide">
          Do not upload private or sensitive videos
        </p>
        <p className="text-[0.55rem] font-mono text-red-400 opacity-70">
          请勿上传私人或敏感视频 · No subas videos privados o sensibles · Ne téléchargez pas de vidéos privées ou sensibles · لا ترفع مقاطع فيديو خاصة أو حساسة
        </p>
        <p className="text-[0.55rem] font-mono text-gray-400">
          This is a demo service. For testing, use{" "}
          <a
            href="https://peach.blender.org/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Big Buck Bunny
          </a>
          ,{" "}
          <a
            href="https://durian.blender.org/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Sintel
          </a>
          , or{" "}
          <a
            href="https://mango.blender.org/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Tears of Steel
          </a>
        </p>
      </div>

      <label className="cursor-pointer">
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        <div
          className="
            px-3
            py-1.5
            border
            border-gray-300
            bg-white
            text-gray-700
            font-mono
            text-[0.70rem]
            tracking-wide
            transition-opacity
            hover:opacity-60
          "
        >
          upload
        </div>
      </label>
      {error && (
        <p className="text-[0.65em] font-mono text-red-600 opacity-60">
          {error}
        </p>
      )}
    </div>
  );
}
