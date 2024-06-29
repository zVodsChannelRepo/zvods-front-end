export interface MessageData {
  image?: string
  text?: string
  emoji?: string
  textEmoji?: string

}
export interface ChatMessage {
  type: 'text' | 'highlighted' | 'superchat' | 'sub' | 'bits' | 'subgift' | 'hype-chat'
  id: string
  message: MessageData[]
  author: {
    name: string
    color: string
    badges: string
  }
  highlighted?: boolean
  customEmote?: boolean
  emoteProvider?: string
  tms: number
}

export interface ChatMessageSub extends ChatMessage {
  type: 'sub'
  months: number
  isResub: boolean
  plan: string // Prime || 1000 || tier 1 yt
  platform: 'twitch' | 'youtube'
}

export interface ChatMessageBits extends ChatMessage {
  type: 'bits'
  amount: string
}

export interface ChatMessageHypeChat extends ChatMessage {
  type: 'hype-chat'
  backgroundColor: string
  level: string // TWO
  amount: string // "BRL 25"
  duration: number
}
export interface ChatMessageSubGift extends ChatMessage {
  type: 'subgift'
  to: string
  plan: string
  amount: number
  platform: 'twitch' | 'youtube'
}

export interface ChatMessageSuperChat extends ChatMessage {
  type: 'superchat'
  isSticker: boolean
  level: string // TWO
  backgroundColor?: string
  headerBackgroundColor?: string
  authorImage?: string
  amount: string // "BRL 25"
  sticker?: {
    url: string
    alt: string
  }
}
export type MessageTypes = Pick<ChatMessage, 'type'>
// @badge-info=subscriber/8;badges=subscriber/6,glhf-pledge/1;color=#00FF7F;display-name=只是里程碑;emotes=;first-msg=0;flags=;id=487a59dc-b518-483d-9606-276c41a2ad28;mod=0;pinned-chat-paid-amount=500;pinned-chat-paid-canonical-amount=500;pinned-chat-paid-currency=BRL;pinned-chat-paid-exponent=2;pinned-chat-paid-is-system-message=0;pinned-chat-paid-level=ONE;returning-chatter=0;room-id=197688174;subscriber=1;tmi-sent-ts=1693346564541;turbo=0;user-id=490091097;user-type= :fanumeroumdawandinha!fanumeroumdawandinha@fanumeroumdawandinha.tmi.twitch.tv PRIVMSG #tioorochitwitch :vai ver a nova temporada do new face reality?
