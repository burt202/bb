export interface RawBot {
  name: string
  keyMembers: Array<string>
  stage: string
  country: string
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
  country: string
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

export interface DbSeasonBot {
  bot_id: string
  bot_name: string
  bot_country: string
  stage_name: string
}

export interface DbSeasonFight {
  id: string
  ko: string
  stage_name: string
  winner_name: string
}

export interface DbBotSeason {
  season_id: string
  season_name: string
  stage_name: string
}

export interface DbBotFight {
  id: string
  ko: string
  season_id: string
  season_name: string
  stage_name: string
  winner_id: string
}

export interface DbMemberSeason {
  season_id: string
  season_name: string
  bot_id: string
  bot_name: string
}

export interface DbTop10Result {
  bot_id: string
  bot_name: string
  count: number
}

export type Season = DbSeason
export type Bot = DbBot
export type Member = DbMember

export interface SeasonBot {
  botId: string
  botName: string
  botCountry: string
  stageName: string
}

export interface SeasonFight {
  competitors: Array<Bot>
  ko: boolean
  stageName: string
  winnerName: string
}

export interface BotSeason {
  seasonId: string
  seasonName: string
  stageName: string
  members: Array<Member>
}

export interface BotFight {
  seasonId: string
  seasonName: string
  stageName: string
  winnerId: string
  against: Array<Bot>
  ko: boolean
}

export interface MemberSeason {
  seasonId: string
  seasonName: string
  botId: string
  botName: string
}

export interface Top10Result {
  botId: string
  botName: string
  count: number
}

export interface DbInterface {
  getAllSeasons: () => Array<Season>
  getSeasonById: (id: string) => Season | undefined
  getSeasonBots: (id: string) => Array<SeasonBot>
  getSeasonFights: (id: string) => Array<SeasonFight>
  getBotById: (id: string) => Bot | undefined
  getBotSeasons: (id: string) => Array<BotSeason>
  getBotFights: (id: string) => Array<BotFight>
  getMemberById: (id: string) => Member | undefined
  getMemberSeasons: (id: string) => Array<MemberSeason>
  getTop10MostWins: () => Array<Top10Result>
  getTop10MostKOs: () => Array<Top10Result>
  getTop10BestWinPercentages: () => Array<Top10Result>
  getTop10BestKOPercentages: () => Array<Top10Result>
  getMostMatchesPlayed: () => Bot
  getTotalBots: () => number
}
