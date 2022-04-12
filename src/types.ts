export interface RawBot {
  name: string
  keyMembers: Array<string>
  stage: string
}

export interface RawFight {
  competitors: Array<string>
  winner: string
  stage: string
  ko: boolean
}

export interface RawSeason {
  year: number
  bots: Array<RawBot>
  fights: Array<RawFight>
}

export interface DbBot {
  id: string
  name: string
}

export interface DbStage {
  id: string
  name: string
  rank: number
}

export interface DbMember {
  id: string
  name: string
}

export interface DbSeason {
  id: string
  name: string
}

export interface DbInterface {
  getAllSeasons: () => Array<DbSeason>
}
