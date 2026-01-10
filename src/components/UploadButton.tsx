import { useState, useEffect } from "react";
import { TcoderClient, type JobStatus } from "tcoder-client";
import { Effect } from "effect";

interface UploadButtonProps {
  baseUrl?: string;
}

export function UploadButton({ baseUrl = "http://localhost:8787" }: UploadButtonProps) {
  // File selection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Job status polling state
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [polling, setPolling] = useState(false);

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Poll job status after upload
  useEffect(() => {
    if (!jobId || !polling) return;

    const client = new TcoderClient({ baseUrl });
    let timeoutId: ReturnType<typeof setTimeout>;

    const pollStatus = async () => {
      try {
        const status = await Effect.runPromise(client.getStatus(jobId));
        setJobStatus(status);

        if (status.status === "completed" || status.status === "failed") {
          setPolling(false);
        } else {
          timeoutId = setTimeout(pollStatus, 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get status");
        setPolling(false);
      }
    };

    pollStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [jobId, polling, baseUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate video file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    // Cleanup previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Set new file and create preview URL
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setJobId(null);
    setJobStatus(null);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const client = new TcoderClient({ baseUrl });
      const blob = new Blob([selectedFile], { type: selectedFile.type });

      const result = await Effect.runPromise(
        client.upload(blob, {
          filename: selectedFile.name,
          contentType: selectedFile.type || "video/mp4",
          preset: "default",
        })
      );

      setJobId(result.jobId);
      setPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setJobId(null);
    setJobStatus(null);
    setPolling(false);
  };

  const handleUploadAnother = () => {
    handleCancel();
  };

  // Show variations when job is completed
  if (jobStatus?.status === "completed" && jobStatus.outputs) {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <p className="text-[0.70rem] font-mono text-gray-600 uppercase tracking-wide">
          transcoding complete
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {jobStatus.outputs.map((output) => {
            const videoSrc = output.cdnUrl ?? output.url;
            return (
              <div key={output.quality} className="flex flex-col gap-2">
                <p className="text-[0.65rem] font-mono text-gray-500 uppercase tracking-wider">
                  {output.quality}
                </p>
                <video
                  src={videoSrc}
                  controls
                  className="w-full aspect-video bg-black border border-gray-200"
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleUploadAnother}
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
            cursor-pointer
          "
        >
          upload another
        </button>
      </div>
    );
  }

  // Show error state for failed jobs
  if (jobStatus?.status === "failed") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-[0.65rem] font-mono text-red-600 opacity-60">
          {jobStatus.error || "Transcoding failed"}
        </p>
        <button
          onClick={handleUploadAnother}
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
            cursor-pointer
          "
        >
          try again
        </button>
      </div>
    );
  }

  // Show polling state
  if (polling && jobStatus) {
    return (
      <div className="flex flex-col items-center gap-4">
        {previewUrl && (
          <video
            src={previewUrl}
            className="w-full max-w-md aspect-video bg-black border border-gray-200"
            muted
          />
        )}
        <p className="text-[0.70rem] font-mono text-gray-500 animate-pulse">
          {jobStatus.status === "uploading" && "uploading..."}
          {jobStatus.status === "queued" && "queued..."}
          {jobStatus.status === "pending" && "pending..."}
          {jobStatus.status === "running" && "transcoding..."}
        </p>
        <p className="text-[0.60rem] font-mono text-gray-400 opacity-50">
          {jobId}
        </p>
      </div>
    );
  }

  // Show video preview with confirm/cancel buttons
  if (selectedFile && previewUrl && !uploading && !jobId) {
    return (
      <div className="flex flex-col items-center gap-4">
        <video
          src={previewUrl}
          controls
          className="w-full max-w-md aspect-video bg-black border border-gray-200"
        />
        <p className="text-[0.60rem] font-mono text-gray-400 truncate max-w-md">
          {selectedFile.name}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
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
              cursor-pointer
            "
          >
            cancel
          </button>
          <button
            onClick={handleConfirmUpload}
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
              cursor-pointer
            "
          >
            confirm upload
          </button>
        </div>
        {error && (
          <p className="text-[0.65em] font-mono text-red-600 opacity-60">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Show uploading state
  if (uploading) {
    return (
      <div className="flex flex-col items-center gap-4">
        {previewUrl && (
          <video
            src={previewUrl}
            className="w-full max-w-md aspect-video bg-black border border-gray-200"
            muted
          />
        )}
        <p className="text-[0.70rem] font-mono text-gray-500 animate-pulse">
          uploading...
        </p>
      </div>
    );
  }

  // Initial state - file selection
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
