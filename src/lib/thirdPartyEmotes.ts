import type { CustomBadges, Vod } from './types';

export async function fetchChannelBttvBadges(channelID: string, platform: Vod['platform']): Promise<CustomBadges.Badge[]> {
  const fetchURL = `https://api.betterttv.net/3/cached/users/${platform}/${channelID}`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as { message?: 'user not found'; channelEmotes?: []; sharedEmotes?: [] }
    if (badgesJSON?.message) return badges
    const hasChannelBadges = (badgesJSON?.channelEmotes || []).length > 0
    const hasSharedBadges = (badgesJSON?.sharedEmotes || []).length > 0
    if (hasChannelBadges) {
      badges.push(...formatCommonBadges(badgesJSON.channelEmotes as CustomBadges.BttvReponseFormats[], 'bttv'))
    }
    if (hasSharedBadges) {
      badges.push(...formatCommonBadges(badgesJSON.sharedEmotes as CustomBadges.BttvReponseFormats[], 'bttv'))
    }
    return badges
  } catch {
    return badges
  }
}
export async function fetchGlobalBttvBadges(): Promise<CustomBadges.Badge[]> {
  const fetchURL = `https://api.betterttv.net/3/cached/emotes/global`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.BttvReponseFormats[]
    badges.push(...formatCommonBadges(badgesJSON as CustomBadges.BttvReponseFormats[], 'bttv'))
    return badges
  } catch {
    return badges
  }
}
export async function fetchGlobalBttvBadgesYoutube(): Promise<CustomBadges.Badge[]> {
  const fetchURL = `https://api.betterttv.net/3/cached/badges/youtube`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.BttvReponseFormats[]
    badges.push(...formatCommonBadges(badgesJSON as CustomBadges.BttvReponseFormats[], 'bttv'))
    return badges
  } catch {
    return badges
  }
}

export async function fetchChannelFzzBadges(channelID: string, platform: Vod['platform']) {
  const fetchURL = `https://api.betterttv.net/3/cached/frankerfacez/users/${platform}/${channelID}`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.BttvReponseFormats[]
    const hasChannelBadges = (badgesJSON || []).length > 0
    if (hasChannelBadges) {
      badges.push(...formatCommonBadges(badgesJSON as CustomBadges.BttvReponseFormats[], 'fzz'))
    }
    return badges
  } catch {
    return badges
  }
}
export async function fetchGlobalFzzBadges() {
  const fetchURL = `https://api.betterttv.net/3/cached/frankerfacez/emotes/global`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.BttvReponseFormats[]
    badges.push(...formatCommonBadges(badgesJSON as CustomBadges.BttvReponseFormats[], 'fzz'))
    return badges
  } catch {
    return badges
  }
}

export async function fetchChannel7tvBadges(channelID: string, platform: Vod['platform']) {
  const fetchURL = `https://7tv.io/v3/users/${platform}/${channelID}`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.SevenTvResponse
    if (!badgesJSON?.emotes) return badges
    badges.push(...formatSevenTvBadges(badgesJSON.emotes, '7tv'))
    return badges
  } catch {
    return badges
  }
}
export async function fetchGlobal7tvBadges() {
  const fetchURL = `https://7tv.io/v3/emote-sets/62cdd34e72a832540de95857`
  const badges = [] as CustomBadges.Badge[]
  try {
    const fetchData = await fetch(fetchURL)
    const badgesJSON = (await fetchData.json()) as CustomBadges.SevenTvResponse
    if (!badgesJSON?.emotes) return badges
    badges.push(...formatSevenTvBadges(badgesJSON.emotes, '7tv'))
    return badges
  } catch {
    return badges
  }
}
const baseUrlBadges = {
  bttv: (code: string, size: string = '2x'): string => {
    return `https://cdn.betterttv.net/emote/${code}/${size}.webp`
  },
  fzz: (code: string, size: string = '2x'): string => {
    return `https://cdn.betterttv.net/emote/${code}/${size}`
  },
  '7tv': (code: string, size: string = '2x.webp'): string => {
    return `https://cdn.7tv.app/emote/${code}/${size}`
  },
}
function formatCommonBadges(badges: CustomBadges.BttvReponseFormats[], provider: CustomBadges.BttvBadgesProviders): CustomBadges.Badge[] {
  const res = badges.map((badge) => {
    let url: string | undefined

    if (provider == 'fzz' && badge.images) {
      url = badge.images['2x_static'] || badge.images['4x_static'] || badge.images['1x_static'] || badge.images?.['2x'] || badge.images?.['4x']
    } else {
      url = baseUrlBadges[provider](provider == 'bttv' ? badge.id : badge.code)
    }
    const obj = { alt: badge.code, id: badge.id, url, provider }
    return obj
  })
  return res
}
function formatSevenTvBadges(badges: CustomBadges.SevenTvEmotes[], provider: CustomBadges.BadgesProviders): CustomBadges.Badge[] {
  const res = badges.map((badge) => {
    const url = baseUrlBadges[provider](badge.id, '2x.webp')
    const obj = { alt: badge.name, id: badge.id, url, provider }
    return obj
  })
  return res
}