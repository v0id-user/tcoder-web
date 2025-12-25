import { useState } from "react";
import { TcoderClient } from "tcoder-client";
import { Effect } from "effect";

interface UploadButtonProps {
  baseUrl?: string;
}

export function UploadButton({ baseUrl = "http://localhost:8787" }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate video file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    setUploading(true);
    setError(null);
    setJobId(null);

    try {
      const client = new TcoderClient({ baseUrl });
      const blob = new Blob([file], { type: file.type });

      const result = await Effect.runPromise(
        client.upload(blob, {
          filename: file.name,
          contentType: file.type || "video/mp4",
          preset: "default",
        })
      );

      setJobId(result.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
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
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          {uploading ? "uploading..." : "upload"}
        </div>
      </label>
      {error && (
        <p className="text-[0.65em] font-mono text-red-600 opacity-60">
          {error}
        </p>
      )}
      {jobId && (
        <p className="text-[0.65em] font-mono text-gray-500 opacity-50">
          {jobId}
        </p>
      )}
    </div>
  );
}

