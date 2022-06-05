export interface RawBot {
  name: string
  keyMembers: Array<string>
  country: string
  primaryWeaponType: string
}

export interface RawFight {
  bots: Array<string>
  winner: string
  stage: string
  ko: boolean
}

export interface RawCompetition {
  name: string
  fights: Array<RawFight>
}

export interface RawSeason {
  season: string
  year: string
  bots: Array<RawBot>
  competitions: Array<RawCompetition>
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
  year: string
}

export interface DbCompetition {
  id: string
  name: string
}

export interface DbPrimaryWeaponType {
  id: string
  name: string
}

export interface DbPrimaryWeaponTypeWinCountBreakdown {
  id: string
  name: string
  count: number
}

export interface DbCompetitionBot {
  bot_id: string
  bot_name: string
  bot_country: string
  stage_name: string
}

export interface DbCompetitionFight {
  id: string
  ko: string
  stage_name: string
  winner_name: string
}

export interface DbBotSeason {
  season_id: string
  season_year: string
  stage_name: string
  primary_weapon_type: string
}

export interface DbBotFight {
  id: string
  ko: string
  season_id: string
  season_year: string
  stage_name: string
  winner_id: string
}

export interface DbMemberSeason {
  season_id: string
  season_year: string
  bot_id: string
  bot_name: string
}

export interface DbTop10Result {
  bot_id: string
  bot_name: string
  count: number
}

export interface DbCountryBot {
  id: string
  name: string
  wins: number | null
  total_fights: number
}

export interface DbPrimaryWeaponTypeWin {
  fight_id: string
  ko: string
  season_id: string
  season_year: string
  winner_name: string
  stage_name: string
}

export type Season = DbSeason
export type Competition = DbCompetition
export type Bot = DbBot
export type Member = DbMember
export type PrimaryWeaponType = DbPrimaryWeaponType

export interface CompetitionBot {
  botId: string
  botName: string
  botCountry: string
  stageName: string
}

export interface CompetitionFight {
  bots: Array<Bot>
  ko: boolean
  stageName: string
  winnerName: string
}

export interface BotSeason {
  seasonId: string
  seasonYear: string
  stageName: string
  primaryWeaponType: string
  members: Array<Member>
}

export interface BotFight {
  seasonId: string
  seasonYear: string
  stageName: string
  winnerId: string
  against: Array<Bot>
  ko: boolean
}

export interface MemberSeason {
  seasonId: string
  seasonYear: string
  botId: string
  botName: string
}

export interface Top10Result {
  botId: string
  botName: string
  count: number
}

export interface SearchResult {
  id: string
  name: string
  type: string
}

export interface CountryBot {
  id: string
  name: string
  wins: number
  totalFights: number
}

export interface PrimaryWeaponTypeWinCountBreakdown {
  id: string
  name: string
  wins: number
  botCount: number
}

export interface PrimaryWeaponTypeWin {
  ko: boolean
  seasonId: string
  seasonYear: string
  winnerName: string
  stageName: string
  bots: Array<Bot>
}

export interface DbInterface {
  getAllSeasons: () => Array<Season>
  getSeasonById: (id: string) => Season | undefined
  getCompetitionsForSeason: (id: string) => Array<Competition>
  getCompetitionBots: (id: string) => Array<CompetitionBot>
  getCompetitionFights: (id: string) => Array<CompetitionFight>
  getBotById: (id: string) => Bot | undefined
  getBotSeasons: (id: string) => Array<BotSeason>
  getBotFights: (id: string) => Array<BotFight>
  getMemberById: (id: string) => Member | undefined
  getMemberSeasons: (id: string) => Array<MemberSeason>
  getTop10MostWins: (allTime: boolean) => Array<Top10Result>
  getTop10MostKOs: (allTime: boolean) => Array<Top10Result>
  getTop10BestWinPercentages: (allTime: boolean) => Array<Top10Result>
  getTop10BestKOPercentages: (allTime: boolean) => Array<Top10Result>
  getMostMatchesPlayed: () => Bot
  getTotalBots: () => number
  getTotalFights: () => number
  search: (term: string) => Array<SearchResult>
  getBotsForCountry: (id: string) => Array<CountryBot>
  getPrimaryWeaponTypeWinCountBreakdown: (
    seasonId?: string,
  ) => Array<PrimaryWeaponTypeWinCountBreakdown>
  getAllPrimaryWeapons: () => Array<PrimaryWeaponType>
  getPrimaryWeaponTypeWins: (
    primaryWeaponTypeId: string,
    seasonId?: string,
  ) => Array<PrimaryWeaponTypeWin>
  getPrimaryWeaponTypeBots: (
    primaryWeaponTypeId: string,
    seasonId: string,
  ) => Array<CompetitionBot>
}
