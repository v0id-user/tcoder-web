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
    <div className="flex flex-col items-center gap-2">
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
