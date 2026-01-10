import { useState, useEffect } from "react";
import { TcoderClient, type JobStatus } from "tcoder-client";
import { Effect } from "effect";
import { Button } from "./Button";
import { VideoPreview } from "./VideoPreview";
import { VideoVariations } from "./VideoVariations";
import { JobStatusDisplay } from "./JobStatusDisplay";
import { FileSelector } from "./FileSelector";

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

  const handleFileSelect = (file: File) => {
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

  const handleReset = () => {
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

  // Completed state - show variations
  if (jobStatus?.status === "completed" && jobStatus.outputs) {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <p className="text-[0.70rem] font-mono text-gray-600 uppercase tracking-wide">
          transcoding complete
        </p>
        <VideoVariations outputs={jobStatus.outputs} />
        <Button onClick={handleReset}>upload another</Button>
      </div>
    );
  }

  // Failed state
  if (jobStatus?.status === "failed") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-[0.65rem] font-mono text-red-600 opacity-60">
          {jobStatus.error || "Transcoding failed"}
        </p>
        <Button onClick={handleReset}>try again</Button>
      </div>
    );
  }

  // Processing state - show status with details
  if (polling && jobStatus && jobId) {
    return (
      <div className="flex flex-col items-center gap-4">
        {previewUrl && <VideoPreview src={previewUrl} muted />}
        <JobStatusDisplay status={jobStatus} jobId={jobId} />
      </div>
    );
  }

  // Preview state - file selected, ready to upload
  if (selectedFile && previewUrl && !uploading && !jobId) {
    return (
      <div className="flex flex-col items-center gap-4">
        <VideoPreview src={previewUrl} controls />
        <p className="text-[0.60rem] font-mono text-gray-400 truncate max-w-md">
          {selectedFile.name}
        </p>
        <div className="flex gap-3">
          <Button onClick={handleReset}>cancel</Button>
          <Button onClick={handleConfirmUpload}>confirm upload</Button>
        </div>
        {error && (
          <p className="text-[0.65em] font-mono text-red-600 opacity-60">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Uploading state
  if (uploading) {
    return (
      <div className="flex flex-col items-center gap-4">
        {previewUrl && <VideoPreview src={previewUrl} muted />}
        <p className="text-[0.70rem] font-mono text-gray-500 animate-pulse">
          uploading to storage...
        </p>
      </div>
    );
  }

  // Initial state - file selection
  return <FileSelector onFileSelect={handleFileSelect} error={error} />;
}
