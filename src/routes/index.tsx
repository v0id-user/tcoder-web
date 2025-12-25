import { createFileRoute } from '@tanstack/react-router'
import { UploadButton } from '../components/UploadButton'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center font-mono">
      <main className="w-full max-w-4xl px-12 py-36 flex flex-col items-center justify-center">
        <h1
          className="
            text-[0.85rem]
            sm:text-[0.95rem]
            md:text-base
            font-bold
            text-center
            tracking-normal
            mb-10
            opacity-80
            uppercase
            "
          style={{
            letterSpacing: '0.03em',
            lineHeight: 4,
          }}
        >
          Tcoder Web Client
        </h1>
        <div className="pt-40" />
        <UploadButton />
        <div className="flex-1" />
        <div className="h-40" />
      </main>
    </div>
  )
}
