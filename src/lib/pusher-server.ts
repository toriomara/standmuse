import Pusher from "pusher"

let _pusher: Pusher | null = null

function getPusherServer(): Pusher | null {
  if (!process.env.PUSHER_APP_ID) return null
  if (!_pusher) {
    _pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_APP_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
      useTLS: true,
    })
  }
  return _pusher
}

export async function triggerPusher(channel: string, event: string, data: object) {
  const pusher = getPusherServer()
  if (!pusher) return
  try {
    await pusher.trigger(channel, event, data)
  } catch (error) {
    console.error("[Pusher trigger]", error)
  }
}

export function authorizeChannel(socketId: string, channelName: string) {
  const pusher = getPusherServer()
  if (!pusher) throw new Error("Pusher not configured")
  return pusher.authorizeChannel(socketId, channelName)
}
