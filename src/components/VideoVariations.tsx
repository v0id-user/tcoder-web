import type { JobOutput } from "tcoder-client";

interface VideoVariationsProps {
  outputs: JobOutput[];
}

export function VideoVariations({ outputs }: VideoVariationsProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
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
      
      {/* Debugging: CDN URLs */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
        <p className="text-[0.60rem] font-mono text-gray-400 uppercase tracking-wider">
          debugging
        </p>
        <div className="flex flex-col gap-1">
          {outputs
            .filter((output) => output.cdnUrl)
            .map((output) => (
              <a
                key={output.quality}
                href={output.cdnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.55rem] font-mono text-gray-500 hover:text-gray-700 break-all underline"
              >
                [{output.quality}] {output.cdnUrl}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
