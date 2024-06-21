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