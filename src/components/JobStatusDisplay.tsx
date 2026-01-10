import type { JobStatus, VideoQuality } from "tcoder-client";

interface JobStatusDisplayProps {
  status: JobStatus;
  jobId: string;
}

const STATUS_INFO: Record<string, { label: string; description: string }> = {
  uploading: {
    label: "Uploading",
    description: "Uploading video to storage...",
  },
  queued: {
    label: "Queued",
    description: "Added to transcoding queue",
  },
  pending: {
    label: "Pending",
    description: "Waiting for transcoding worker...",
  },
  running: {
    label: "Transcoding",
    description: "Video is being transcoded",
  },
};

const PRESET_INFO: Record<string, string> = {
  default: "Standard quality outputs",
  "web-optimized": "Optimized for web streaming",
  hls: "HLS streaming format",
  "hls-adaptive": "Adaptive bitrate HLS",
};

// Supported video qualities from tcoder-client
const SUPPORTED_QUALITIES: VideoQuality[] = [
  "144p",
  "360p",
  "720p",
];

export function JobStatusDisplay({ status, jobId }: JobStatusDisplayProps) {
  const info = STATUS_INFO[status.status] ?? {
    label: status.status,
    description: "Processing...",
  };

  const presetDescription = status.preset
    ? PRESET_INFO[status.preset] ?? status.preset
    : null;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500" />
        </span>
        <p className="text-[0.75rem] font-mono text-gray-600 uppercase tracking-wide">
          {info.label}
        </p>
      </div>

      {/* Description */}
      <p className="text-[0.65rem] font-mono text-gray-500">
        {info.description}
      </p>

      {/* Current settings */}
      <div className="flex flex-col gap-1 mt-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.60rem] font-mono text-gray-400 uppercase">
            Preset
          </span>
          <span className="text-[0.60rem] font-mono text-gray-600">
            {status.preset ?? "default"}
          </span>
        </div>
        {presetDescription && (
          <p className="text-[0.55rem] font-mono text-gray-400 text-right">
            {presetDescription}
          </p>
        )}
        {status.machineId && (
          <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-[0.60rem] font-mono text-gray-400 uppercase">
              Worker
            </span>
            <span className="text-[0.60rem] font-mono text-gray-600">
              {status.machineId}
            </span>
          </div>
        )}
      </div>

      {/* Available presets */}
      <div className="flex flex-col gap-1 mt-1">
        <p className="text-[0.55rem] font-mono text-gray-400 uppercase">
          Available presets
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {Object.keys(PRESET_INFO).map((preset) => (
            <span
              key={preset}
              className={`
                text-[0.55rem] font-mono px-1.5 py-0.5 rounded
                ${status.preset === preset
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-400"
                }
              `}
            >
              {preset}
            </span>
          ))}
        </div>
      </div>

      {/* Supported qualities */}
      <div className="flex flex-col gap-1 mt-1">
        <p className="text-[0.55rem] font-mono text-gray-400 uppercase">
          Supported qualities
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {SUPPORTED_QUALITIES.map((quality) => (
            <span
              key={quality}
              className="text-[0.55rem] font-mono px-1.5 py-0.5 rounded bg-gray-50 text-gray-400"
            >
              {quality}
            </span>
          ))}
        </div>
      </div>

      {/* Job ID */}
      <p className="text-[0.55rem] font-mono text-gray-300 mt-2">
        {jobId}
      </p>
    </div>
  );
}
