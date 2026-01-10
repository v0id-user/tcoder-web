import type { JobStatus } from "tcoder-client";

interface VideoVariationsProps {
  outputs: NonNullable<JobStatus["outputs"]>;
}

export function VideoVariations({ outputs }: VideoVariationsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {outputs.map((output) => {
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
  );
}
