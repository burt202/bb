export const SITE_NAME = "Battlebots DB"

export function convertNameToId(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

export function round(decimals: number, num: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function getPercentage(rawDataLength: number, portionLength: number) {
  if (rawDataLength === 0) return "0%"
  return `${round(0, (portionLength / rawDataLength) * 100)}%`
}

export function groupBy<T>(grouper: (d: T) => string, data: Array<T>) {
  return data.reduce((acc, val) => {
    const key = grouper(val)
    if (acc[key]) {
      return {...acc, [key]: [...acc[key], val]}
    }

    return {...acc, [key]: [val]}
  }, {} as Record<string, Array<T>>)
}

export function setTitle(title: string) {
  document.title = `${SITE_NAME} - ${title}`
}

export const stages = [
  {id: "winner", text: "Winner", rank: 1},
  {id: "bounty", text: "Bounty Match", rank: 2},
  {id: "final", text: "Final", rank: 3},
  {id: "semi", text: "Semi-Final", rank: 4},
  {id: "quarter", text: "Quarter-Final", rank: 5},
  {id: "roundof16", text: "Round Of 16", rank: 6},
  {id: "roundof32", text: "Round Of 32", rank: 7},
  {id: "playoff", text: "Playoff", rank: 8},
  {id: "qualifier", text: "Qualifier", rank: 9},
  {id: "season", text: "Season", rank: 9},
  {id: "prequalifier", text: "Pre-Qualifier", rank: 10},
]

export const stageNameMap = stages.reduce((acc, val) => {
  acc[val.id] = val.text
  return acc
}, {} as Record<string, string>)

export const countryNameMap = {
  aus: "Australia",
  bra: "Brazil",
  can: "Canada",
  chn: "China",
  deu: "Germany",
  fra: "France",
  gbr: "Great Britain",
  ind: "India",
  kor: "South Korea",
  nld: "Holland",
  nzl: "New Zealand",
  rus: "Russia",
  usa: "USA",
} as Record<string, string>

export const primaryWeaponTypeNameMap = {
  crusher: "Crusher",
  vertical: "Vertical Spinner",
  horizontal: "Horizontal Spinner",
  hammer: "Hammer/Axe",
  lifter: "Lifter",
  fullbody: "Full Body Spinner",
  grappler: "Grappler",
  flipper: "Flipper",
  saw: "Saw",
  multi: "Multi",
  other: "Other",
} as Record<string, string>
