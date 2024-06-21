export type Vod = {
  id: number
  channel: string
  vodId: string
  chatId: string
  duration: number
  title: string
  status: 'public' | String
  date: string
  platform: 'twitch' | 'youtube' | String
  channelId: string
}
