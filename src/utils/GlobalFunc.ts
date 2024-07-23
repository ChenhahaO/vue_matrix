import { getRandNodeId } from '@/utils/ProcessUtil'

export function generateStr(len: number) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function delField(cols: any[], i: number) {
  cols.splice(i, 1)
}

export function copyField(cols: any[], i: number) {
  const col = deepCopy(cols[i])
  col.id = getRandNodeId()
  col.key = `${col.type}_${generateStr(8)}`
  cols.push(col)
}
