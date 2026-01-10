type Preset = "default" | "web-optimized" | "hls" | "hls-adaptive";

interface PresetSelectorProps {
  value: Preset;
  onChange: (preset: Preset) => void;
}

const PRESETS: { value: Preset; label: string; description: string }[] = [
  {
    value: "default",
    label: "Default",
    description: "Standard quality outputs",
  },
  {
    value: "web-optimized",
    label: "Web Optimized",
    description: "Optimized for web streaming",
  },
  {
    value: "hls",
    label: "HLS",
    description: "HLS streaming format",
  },
  {
    value: "hls-adaptive",
    label: "HLS Adaptive",
    description: "Adaptive bitrate HLS",
  },
];

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <p className="text-[0.60rem] font-mono text-gray-400 uppercase tracking-wider">
        Preset
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`
              flex flex-col items-start gap-0.5 p-2 border text-left transition-all cursor-pointer
              ${value === preset.value
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <span className="text-[0.65rem] font-mono text-gray-700">
              {preset.label}
            </span>
            <span className="text-[0.55rem] font-mono text-gray-400">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Preset };
