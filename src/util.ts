const audioCache = new Map<string, HTMLAudioElement>()

export enum Sound {
  Floor = "floor.ogg",
  Tetris = "tetris.mp3",
  LineClear = "line-clear.mp3"
}

export function assert(condition: boolean, reasoning: string): asserts condition {
  if (!condition)
    throw new Error(`assertion failed: ${reasoning}`)
}

export function randomSign(): number {
  return Math.random() < 0.5 ? -1 : 1
}

export function randomInt(minInclusive: number, maxExclusive: number): number {
  assert(minInclusive < maxExclusive, "min should be less than max")

  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive
}

export function chooseRandom<T>(choices: T[]): T {
  assert(choices.length > 0, "choices array should not be empty, otherwise there's nothing to choose from")

  return choices[randomInt(0, choices.length)]
}

export function preloadAudios(audios: Sound[]) {
  audios.forEach(audio => {
    if (audioCache.has(audio))
      return

    const audioElement = new Audio(`/${audio}`)

    audioElement.volume = 0

    audioElement.play().then(() => {
      audioElement.pause()
      audioElement.currentTime = 0
      audioElement.volume = 1
    })

    audioCache.set(audio, audioElement)
  })
}

export function playSound(asset: Sound, loop = false) {
  if (!audioCache.has(asset)) {
    const audio = new Audio(`/${asset}`)

    audioCache.set(asset, audio)
  }

  const audio = audioCache.get(asset)!

  audio.currentTime = 0
  audio.loop = loop
  audio.play()
}

export function playThemeAudio() {
  const themeAudio = new Audio("/theme.mp3")

  themeAudio.loop = true
  themeAudio.volume = 0.5
  themeAudio.pause()

  const resolveOnUserInteraction = () => {
    themeAudio.play()
    window.removeEventListener("click", resolveOnUserInteraction)
  }

  window.addEventListener("click", resolveOnUserInteraction)
}
