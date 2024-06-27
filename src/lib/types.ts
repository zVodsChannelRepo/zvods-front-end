export type Vod = {
  id: number
  channel: string
  vodId: string
  chatId: string
  title: string
  status: 'public' | String
  date: string
  platform: 'twitch' | 'youtube' | String
  channelId: string
}

type Social = {
  id: number;
  name: string;
  link: string;
  channelID: number;
};

export type Channel = {
  id: number;
  route: string;
  name: string;
  new: boolean;
  launched: boolean;
  bannerImage: string;
  avatarImage: string;
  color: string;
  colorDark: string;
  channelId: string;
  socials: Social[];
};


export namespace ChatMessages {
  export interface MessageData {
    image?: string
    text?: string
    emoji?: string
  }
  export interface Common {
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
    createdAt?: string
    tms: number
  }

  export interface ChatMessageSub extends Common {
    type: 'sub'
    sub: {
      months: number
      isResub: boolean
      plan: string
    }
  }

  export interface ChatMessageBits extends Common {
    type: 'bits'
    bits: {
      amount: number
    }
  }

  export interface ChatMessageSubGift extends Common {
    type: 'subgift'
    subgift: {
      to: string
      plan: string
      amount: number
    }
  }

  export interface ChatMessageSuperChat extends Common {
    type: 'superchat'
    superchat: {
      isSticker: boolean
      formated: string
      amount: number
      sticker?: {
        url: string
        alt: string
      }
    }
  }
}
export type FormatChatMessage = ChatMessages.Common & {
  bits?: ChatMessages.ChatMessageBits['bits']
  sub?: ChatMessages.ChatMessageSub['sub']
  subgift?: ChatMessages.ChatMessageSubGift['subgift']
  superChat?: ChatMessages.ChatMessageSuperChat['superchat']
}


export namespace CustomBadges {
  export type BadgesProviders = 'bttv' | 'fzz' | '7tv'
  export type BttvBadgesProviders = 'bttv' | 'fzz'
  export interface Badge {
    id: string
    alt: string
    provider: BadgesProviders
    url: string
  }
  export interface BttvReponseFormats {
    id: string
    code: string
    imageType: 'png' | 'gif'
    animated: boolean
    images?: {
      '1x': string
      '2x': string
      '4x': string
      '1x_static'?: string
      '2x_static'?: string
      '4x_static'?: string
    }
  }

  export interface SevenTvResponseFiles {
    name: string
    static_name: string
    width: number
    height: number
    frame_count: number
    size: number
    format: string
  }
  export interface SevenTvEmotes {
    id: string
    name: string
    data: {
      animated: boolean
      host: {
        url: string
        files: SevenTvResponseFiles[]
      }
    }
  }


  export interface SevenTvResponse {
    emotes_count: number
    emotes: SevenTvEmotes[]
  }
}

export type TwitchBadgesResponseVersions = {
  id: string,
  image_url_1x: string,
  image_url_2x: string,
  image_url_4x: string,
  title: string,
  description: string
  click_action: string,
  click_url: string

}
export type TwitchBadgesResponse = {
  [key: string]: {
    "versions": TwitchBadgesResponseVersions[]
  }
}

export type BadgesVersions = {
  id: string
  description: string
  image: string
}
export type Badges = Map<string, Map<string, BadgesVersions>>
export type EmotesData = {
  id: string | number
  provider: CustomBadges.BadgesProviders
  alt: string
  url: string
}
export type Emotes = Map<string, EmotesData>

declare global {
  interface Window {
    channel?: Channel
    loadChannelData?: (data: Channel) => void
  }
}
