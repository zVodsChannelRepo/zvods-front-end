import { userBadges } from 'src/data/userBadges'
import type { Badges, BadgesVersions, CustomBadges, TwitchBadgesResponse, TwitchBadgesResponseVersions, Vod } from './types'
import { fetchGlobalBttvBadges, fetchChannelBttvBadges, fetchChannel7tvBadges, fetchGlobal7tvBadges, fetchGlobalFzzBadges, fetchChannelFzzBadges } from './thirdPartyEmotes'

export function chatIsPaused() {
  const pauseChatBox = document.querySelector('#pause-chat-box') as HTMLDivElement
  if (!pauseChatBox) return false
  if (!pauseChatBox.classList.contains('hidden')) return true
  return false
}
export function handlerChatScroll(e: Event) {
  const $messages = e.target as HTMLDivElement
  const pauseChatBox = document.querySelector('#pause-chat-box') as HTMLDivElement
  if ($messages.scrollTop >= 0) {
    scrollChat()
    pauseChatBox.classList.add('hidden')
    pauseChatBox.classList.remove('flex')
  } else {
    if (!chatIsPaused()) {
      pauseChatBox.classList.add('flex')
      pauseChatBox.classList.remove('hidden')
    }
  }
}

export function scrollChat() {
  const chatBox = document.querySelector('.messages') as HTMLDivElement
  chatBox.scrollTop = 0
}

export function parseBadgesString(badges: string) {
  const badgesArr = badges?.split(",") || []
  let badgesObj: { [key: string]: string } = {}
  badgesArr.map(badge => {
    const [key, value] = badge.split("/")
    badgesObj[key] = value
  })
  return badgesObj
}

export async function loadBadges(platform: Vod['platform'], channelId: string, cb: (badgesLoaded: Badges) => void) {
  const badgesLoaded: Badges = new Map()
  if (platform == 'twitch') {
    const req = await fetch(`https://api2.zvods.com/api/v1/twitch/badges/${channelId}`)
    const badgesData = (await req.json()) as { error: string; message: string } | TwitchBadgesResponse
    if (!badgesData?.error) {
      Object.entries(badgesData).forEach(([k, v]) => {
        const versions = new Map<string, BadgesVersions>()
        v.versions.forEach((version: TwitchBadgesResponseVersions) => {
          versions.set(version.id, {
            id: version.id,
            description: version?.description || version?.title,
            image: version?.image_url_4x || version?.image_url_2x || version?.image_url_1x,
          })
        }),
          badgesLoaded.set(k, versions)
      })
    }
  } else if (platform == 'youtube') {
    // set default badges for youtube channel
    badgesLoaded.set(
      'verified',
      new Map().set('1', {
        description: 'Verified',
        id: '1',
        image: userBadges.verified,
      })
    )
    badgesLoaded.set(
      'moderator',
      new Map().set('1', {
        description: 'Moderator',
        id: '1',
        image: userBadges.moderator,
      })
    )
    badgesLoaded.set(
      'owner',
      new Map().set('1', {
        description: 'Owner',
        id: '1',
        image: userBadges.owner,
      })
    )
  }
  cb(badgesLoaded)
}

export async function loadThirdPartyEmotes(platform: Vod['platform'], channelId: string, cb: (emotesLoaded: CustomBadges.Badge[]) => void) {
  let customEmotesList: CustomBadges.Badge[] = []
  let bttvEmotes = true
  let sevenTvEmotes = true
  let fzzEmotes = true
  if (bttvEmotes) {
    const bttvGlobalBadges = (await fetchGlobalBttvBadges().catch((e) => { })) || []
    const bttvBadges = (await fetchChannelBttvBadges(channelId, platform).catch((e) => { })) || []
    customEmotesList.push(...bttvGlobalBadges, ...bttvBadges)
    console.log(`${bttvGlobalBadges.length + bttvBadges.length} BTTV Emotes loaded`)
  }

  if (sevenTvEmotes) {
    const sevenTvBadges = (await fetchChannel7tvBadges(channelId, platform).catch((e) => { })) || []
    const sevenTvGlobalBadges = (await fetchGlobal7tvBadges().catch((e) => { })) || []
    customEmotesList.push(...sevenTvBadges, ...sevenTvGlobalBadges)
    console.log(`${sevenTvBadges.length + sevenTvGlobalBadges.length} 7TV Emotes loaded`)
  }

  if (fzzEmotes) {
    const fzzGlobalBadges = (await fetchGlobalFzzBadges().catch((e) => { })) || []
    const fzzBadges = (await fetchChannelFzzBadges(channelId, platform).catch((e) => { })) || []
    customEmotesList.push(...fzzGlobalBadges, ...fzzBadges)
    console.log(`${fzzGlobalBadges.length + fzzBadges.length} FZZ Emotes loaded`)
  }

  console.log(`${customEmotesList.length} third-party emotes loaded`)
  cb(customEmotesList)
}