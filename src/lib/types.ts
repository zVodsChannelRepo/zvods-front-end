export type Vod = {
  id: number
  channel: string
  vodId: string
  chatId: string
  duration: number
  title: string
  status: 'public' | String
  date: '2024-05-21T03:00:00.000Z'
  platform: 'twitch' | 'youtube' | String
  channelId: string
}
