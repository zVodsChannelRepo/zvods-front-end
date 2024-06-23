import DiscordIcon from "@components/icons/DiscordIcon.astro"
import FacebookIcon from "@components/icons/FacebookIcon.astro"
import InstagramIcon from "@components/icons/InstagramIcon.astro"
import LanguageIcon from "@components/icons/LanguageIcon.astro"
import RedditIcon from "@components/icons/RedditIcon.astro"
import TikTokIcon from "@components/icons/TikTokIcon.astro"
import TwitchIcon from "@components/icons/TwitchIcon.astro"
import TwitterIcon from "@components/icons/TwitterIcon.astro"
import YouTubeIcon from "@components/icons/YouTubeIcon.astro"


interface SocialsIconsType {
  [key: string]: {
    color: string
    icon: any
  }
}

export const SocialsIcons = {
  "Twitter": {
    color: "text-sky-300",
    icon: TwitterIcon
  },
  "YouTube": {
    color: "text-red-600",
    icon: YouTubeIcon
  },
  "Instagram": {
    color: "text-pink-500",
    icon: InstagramIcon
  },
  "Tiktok": {
    color: "text-pink-600",
    icon: TikTokIcon
  },
  "Reddit": {
    color: "text-orange-500",
    icon: RedditIcon
  },
  "Twitch": {
    color: "text-purple-500",
    icon: TwitchIcon
  },
  "Discord": {
    color: "text-purple-300",
    icon: DiscordIcon
  },
  "Facebook": {
    color: "text-blue-600",
    icon: FacebookIcon
  },
  "default": {
    color: "text-yellow-500",
    icon: LanguageIcon
  },
} as SocialsIconsType