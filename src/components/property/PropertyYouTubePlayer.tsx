
import { useEffect, useRef } from "react"

interface PropertyYouTubePlayerProps {
  youtubeUrl?: string | null
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
}

export const PropertyYouTubePlayer = ({ 
  youtubeUrl,
  autoplay = false,
  muted = true,
  controls = true,
  className
}: PropertyYouTubePlayerProps) => {
  const playerRef = useRef<HTMLIFrameElement>(null)

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  useEffect(() => {
    if (!youtubeUrl) return

    const videoId = getYouTubeVideoId(youtubeUrl)
    if (!videoId || !playerRef.current) return

    // Update iframe src with parameters
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      controls: controls ? "1" : "0",
      rel: "0", // Don't show related videos
      modestbranding: "1", // Minimal YouTube branding
      loop: "1", // Loop the video
      playlist: videoId // Required for looping
    })

    playerRef.current.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }, [youtubeUrl, autoplay, muted, controls])

  if (!youtubeUrl) return null

  return (
    <div className={`w-full h-full overflow-hidden bg-black ${className || ""}`}>
      <iframe
        ref={playerRef}
        className="w-full h-full object-cover"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
