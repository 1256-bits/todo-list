export default function parseDate (date: Date, forDisplay: boolean = false): string | string[] {
  const year = date.getFullYear()
  const processRaw = (raw: number): string => {
    const rawStr = String(raw)
    return (rawStr.length === 1) ? '0' + rawStr : rawStr
  }
  // only months are counted from 0
  const month = processRaw(date.getMonth() + 1)
  const day = processRaw(date.getDate())
  const hour = processRaw(date.getHours())
  const minute = processRaw(date.getMinutes())
  if (forDisplay) {
    return [`${day}/${month}/${year}`, `${hour}:${minute}`]
  }
  return `${year}-${month}-${day}T${hour}:${minute}`
}
