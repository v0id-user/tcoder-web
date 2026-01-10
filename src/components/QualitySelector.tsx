import type { VideoQuality } from "tcoder-client";

interface QualitySelectorProps {
  value: VideoQuality[];
  onChange: (qualities: VideoQuality[]) => void;
}

const QUALITIES: {
  value: VideoQuality;
  label: string;
  description: string;
}[] = [
  {
    value: "144p",
    label: "144p",
    description: "256x144, 100k video, 64k audio",
  },
  {
    value: "360p",
    label: "360p",
    description: "640x360, 400k video, 96k audio",
  },
  {
    value: "720p",
    label: "720p",
    description: "1280x720, 1500k video, 128k audio",
  },
];

export function QualitySelector({ value, onChange }: QualitySelectorProps) {
  const toggleQuality = (quality: VideoQuality) => {
    if (value.includes(quality)) {
      onChange(value.filter((q) => q !== quality));
    } else {
      onChange([...value, quality].sort((a, b) => {
        const order = ["144p", "360p", "720p"];
        return order.indexOf(a) - order.indexOf(b);
      }));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <p className="text-[0.60rem] font-mono text-gray-400 uppercase tracking-wider">
        Output Qualities
      </p>
      <div className="flex flex-col gap-2">
        {QUALITIES.map((quality) => (
          <button
            key={quality.value}
            type="button"
            onClick={() => toggleQuality(quality.value)}
            className={`
              flex items-center justify-between gap-2 p-2 border text-left transition-all cursor-pointer
              ${value.includes(quality.value)
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[0.65rem] font-mono text-gray-700">
                {quality.label}
              </span>
              <span className="text-[0.55rem] font-mono text-gray-400">
                {quality.description}
              </span>
            </div>
            <div
              className={`
                w-4 h-4 border-2 flex items-center justify-center transition-all
                ${value.includes(quality.value)
                  ? "border-gray-600 bg-gray-600"
                  : "border-gray-300 bg-white"
                }
              `}
            >
              {value.includes(quality.value) && (
                <span className="text-[0.50rem] text-white">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
      {value.length === 0 && (
        <p className="text-[0.55rem] font-mono text-gray-400 italic">
          Select at least one quality
        </p>
      )}
    </div>
  );
}
