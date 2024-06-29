import { userBadges } from 'src/data/userBadges'
import type { ChatMessage } from './ChatTypes'
import { fetchChannel7tvBadges, fetchChannelBttvBadges, fetchChannelFzzBadges, fetchGlobal7tvBadges, fetchGlobalBttvBadges, fetchGlobalFzzBadges } from './thirdPartyEmotes'
import type { Badges, BadgesVersions, CustomBadges, Emotes, FormatChatMessage, TwitchBadgesResponse, TwitchBadgesResponseVersions, Vod } from './types'

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

export function createMessagePrinter({ MAX_MESSAGES, chatBox, messageTemplate }: { chatBox: HTMLDivElement, MAX_MESSAGES: number, messageTemplate: HTMLTemplateElement | null }) {

  return function printMessage(message: FormatChatMessage, badges: Badges, customEmotes: Emotes) {
    if (!messageTemplate) return
    const template = messageTemplate?.content?.cloneNode(true) as HTMLDivElement
    const authorName = template.querySelector('.authorName') as HTMLSpanElement
    authorName.textContent = message.author.name
    authorName.style.color = message.author.color
    const $content = template.querySelector('.content')
    template.id = message.id

    function pushBadge(url: string, alt: string) {
      const $badgeTemplate = (template.querySelector('#badge-template') as HTMLTemplateElement)?.content?.cloneNode(true) as DocumentFragment
      const $badge = $badgeTemplate.querySelector('img') as HTMLImageElement
      $badge.src = url
      $badge.alt = alt
      template.querySelector('.badges')?.appendChild($badge)
    }

    message.author.badges.split(',').forEach((badgeStr) => {
      const [name, version] = badgeStr.split('/')
      if (name == 'image') {
        pushBadge(version, name)
      } else {
        const badge = badges.get(name)?.get(version)
        if (badge) {
          pushBadge(badge.image, badge.description)
        }
      }
    })

    function createImageEmote(url: string, alt: string) {
      const $emoteTemplate = (template.querySelector('#emote-template') as HTMLTemplateElement)?.content?.cloneNode(true) as DocumentFragment
      const $emote = $emoteTemplate.querySelector('img') as HTMLImageElement
      $emote.src = url
      $emote.alt = alt
      return $emote
    }

    function createMessageSpan(text: string) {
      const span = document.createElement('span')
      span.textContent = text
      return span
    }

    function parseTextContent(text: string) {
      if (customEmotes.size == 0) return createMessageSpan(text)
      const elements = []
      const parts = text.split(' ')
      let textBuffer = ''

      parts.forEach((part) => {
        const emote = customEmotes.get(part)

        if (emote) {
          if (textBuffer) {
            elements.push(createMessageSpan(textBuffer))
            textBuffer = ''
          }
          elements.push(createImageEmote(emote.url, emote.alt))
        } else {
          textBuffer += `${part} `
        }
      })

      if (textBuffer) {
        elements.push(createMessageSpan(textBuffer))
      }

      return elements
    }
    message.message
      .flatMap((msg) => {
        if (msg?.image) {
          return createImageEmote(msg.image, 'Emote')
        }
        if (msg?.text || msg?.emoji) {
          return parseTextContent(msg?.emoji || msg.text!)
        }
      })
      .forEach((el) => el && $content?.appendChild(el))
    chatBox.appendChild(template)

    const printedMessages = chatBox?.childElementCount
    if (printedMessages > MAX_MESSAGES && !chatIsPaused()) {
      for (let i = 0; i < printedMessages - MAX_MESSAGES; i++) {
        chatBox.firstElementChild?.remove()
      }
    }
  }
}
export function getMessageIndexByTime(messages: ChatMessage[], time: number) {
  function binarySearch(messages: ChatMessage[], targetTime: number) {
    let left = 0
    let right = messages.length - 1
    let foundIndex = -1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (messages[mid].tms === targetTime) {
        return mid
      } else if (messages[mid].tms < targetTime) {
        left = mid + 1
        foundIndex = mid
      } else {
        right = mid - 1
      }
    }

    return foundIndex
  }

  return binarySearch(messages, time)
}