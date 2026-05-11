import PusherClient from "pusher-js"

let _client: PusherClient | null = null

export function getPusherClient(): PusherClient | null {
  if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) return null
  if (!_client) {
    _client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    })
  }
  return _client
}
