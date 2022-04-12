export interface Bot {
  name: string
  keyMembers: Array<string>
  stage: string
}

export interface Fight {
  competitors: Array<string>
  winner: string
  stage: string
  ko: boolean
}

export interface Season {
  year: number
  bots: Array<Bot>
  fights: Array<Fight>
}
