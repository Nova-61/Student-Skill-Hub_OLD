interface MessageCardProps {
  sender: string
  text: string
  isMe?: boolean
}

export default function MessageCard({ sender, text, isMe }: MessageCardProps) {
  return (
    <div className={`p-2 my-1 rounded-lg max-w-xs text-xs ${
      isMe 
        ? 'bg-blue-600 text-white ml-auto' 
        : 'bg-gray-200 text-gray-900 mr-auto'
    }`}>
      <div className="font-semibold text-xs mb-0.5">{sender}</div>
      <div className="break-words">{text}</div>
    </div>
  )
}
