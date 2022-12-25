const _keys = ['w', 'a', 's', 'd'] as const
type Keys = typeof _keys[number]

type PlayerKeys = Record<Keys, boolean>

const isPlayerKeys = (value: string): value is Keys => {
  return _keys.includes(value as any)
}

export { type PlayerKeys, isPlayerKeys }

// const keys = ['w', 'a', 's', 'd'] as const

// type PlayerKeys = {
//   [key in typeof keys[number]]: boolean
// }

// const isPlayerKeys = (value: string): value is keyof PlayerKeys => {
//   return keys.includes(value as any)
// }
