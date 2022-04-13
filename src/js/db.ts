import initSqlJs, {Database} from "sql.js"
import * as uuid from "uuid"
import {
  DbBot,
  DbInterface,
  DbMember,
  DbSeason,
  DbSeasonBot,
  DbSeasonFight,
  DbStage,
  RawFight,
  RawSeason,
} from "./types"
import {convertNameToId} from "./utils"

function createTables(db: Database) {
  db.run(`
    CREATE TABLE seasons (
      id text UNIQUE NOT NULL,
      name text UNIQUE NOT NULL,
      primary key (id)
    );

    CREATE TABLE stages (
      id text UNIQUE NOT NULL,
      name text UNIQUE NOT NULL,
      rank int NOT NULL,
      primary key (id)
    );

    CREATE TABLE bots (
      id text UNIQUE NOT NULL,
      name text UNIQUE NOT NULL,
      primary key (id)
    );

    CREATE TABLE members (
      id text UNIQUE NOT NULL,
      name text UNIQUE NOT NULL,
      primary key (id)
    );

    CREATE TABLE season_bots (
      season_id text NOT NULL,
      bot_id text NOT NULL,
      stage_id text NOT NULL,
      primary key (season_id, bot_id),
      foreign key (season_id) references seasons(id),
      foreign key (bot_id) references bots(id),
      foreign key (stage_id) references stages(id)
    );

    CREATE TABLE bot_members (
      bot_id text NOT NULL,
      member_id text NOT NULL,
      season_id text NOT NULL,
      primary key (member_id, season_id),
      foreign key (bot_id) references bots(id),
      foreign key (member_id) references members(id),
      foreign key (season_id) references seasons(id)
    );

    CREATE TABLE fights (
      id text UNIQUE NOT NULL,
      ko text NOT NULL,
      stage_id text NOT NULL,
      winner_id text NOT NULL,
      season_id text NOT NULL,
      primary key (id),
      foreign key (winner_id) references bots(id),
      foreign key (season_id) references seasons(id),
      foreign key (stage_id) references stages(id)
    );

    CREATE TABLE fight_competitors (
      fight_id text NOT NULL,
      bot_id text NOT NULL,
      primary key (fight_id, bot_id),
      foreign key (fight_id) references fights(id),
      foreign key (bot_id) references bots(id)
    );
  `)
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getOne<T>(db: Database, sql: string, params?: {[key: string]: any}) {
  const result = db.exec(sql, params)

  if (result.length === 0) {
    return undefined
  }

  const match = result[0]
  const values = match.values[0]

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const obj = {} as Record<string, any>

  match.columns.forEach((col, i) => {
    obj[col] = values[i]
  })

  return obj as T
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getMany<T>(db: Database, sql: string, params?: {[key: string]: any}) {
  const result = db.exec(sql, params)

  const match = result[0]

  const data = match.values.map((v) => {
    return v.reduce((acc, val, i) => {
      acc[match.columns[i]] = val
      return acc
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    }, {} as Record<string, any>)
  })

  return data as Array<T>
}

function getStageByName(db: Database, name: string) {
  return getOne<DbStage>(db, "SELECT * FROM stages WHERE name=:name", {
    ":name": name,
  })
}

function getBotByName(db: Database, name: string) {
  return getOne<DbBot>(db, "SELECT * FROM bots WHERE name=:name", {
    ":name": name,
  })
}

function getMemberByName(db: Database, name: string) {
  return getOne<DbMember>(db, "SELECT * FROM members WHERE name=:name", {
    ":name": name,
  })
}

function insertBot(db: Database, name: string) {
  const result = getBotByName(db, name)

  if (result === undefined) {
    const id = convertNameToId(name)
    db.run("INSERT INTO bots VALUES (?,?)", [id, name])
    return {id, name} as DbBot
  }

  return result
}

function addBotToSeason(
  db: Database,
  seasonId: string,
  botId: string,
  stageName: string,
) {
  const stage = getStageByName(db, stageName)

  if (stage === undefined) {
    throw new Error(`Cannot find stage: ${stageName}`)
  }

  db.run("INSERT INTO season_bots VALUES (?,?,?)", [seasonId, botId, stage.id])
}

function insertMember(db: Database, name: string) {
  const result = getMemberByName(db, name)

  if (result === undefined) {
    const id = convertNameToId(name)
    db.run("INSERT INTO members VALUES (?,?)", [id, name])
    return {id, name} as DbMember
  }

  return result
}

function addMemberToBotForSeason(
  db: Database,
  botId: string,
  memberId: string,
  seasonId: string,
) {
  db.run("INSERT INTO bot_members VALUES (?,?,?)", [botId, memberId, seasonId])
}

function insertFight(db: Database, seasonId: string, fight: RawFight) {
  const id = uuid.v4()

  if (!fight.competitors.includes(fight.winner)) {
    throw new Error(`Fight winner not listed in competitors: ${fight.winner}`)
  }

  const stage = getStageByName(db, fight.stage)

  if (stage === undefined) {
    throw new Error(`Cannot find stage: ${fight.stage}`)
  }

  const winningBot = getBotByName(db, fight.winner)

  if (winningBot === undefined) {
    throw new Error(`Cannot find bot: ${fight.winner}`)
  }

  db.run("INSERT INTO fights VALUES (?,?,?,?,?)", [
    id,
    fight.ko.toString(),
    stage.id,
    winningBot.id,
    seasonId,
  ])

  return {id}
}

function addBotToFight(db: Database, fightId: string, botName: string) {
  const bot = getBotByName(db, botName)

  if (bot === undefined) {
    throw new Error(`Cannot find bot: ${botName}`)
  }

  db.run("INSERT INTO fight_competitors VALUES (?,?)", [fightId, bot.id])
}

function populateDatabase(db: Database, data: Array<RawSeason>) {
  db.run(`
    INSERT INTO stages VALUES ('${uuid.v4()}', 'winner', 1);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'final', 2);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'semi', 3);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'quarter', 4);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'roundof16', 5);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'roundof32', 6);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'qualifier', 7);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'season', 7);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'prequalifier', 8);
  `)

  data.forEach((season) => {
    const seasonId = convertNameToId(season.year.toString())
    db.run("INSERT INTO seasons VALUES (?,?)", [seasonId, season.year])

    season.bots.forEach((bot) => {
      const insertedBot = insertBot(db, bot.name)
      addBotToSeason(db, seasonId, insertedBot.id, bot.stage)

      bot.keyMembers.forEach((member) => {
        const insertedMember = insertMember(db, member)
        addMemberToBotForSeason(db, insertedBot.id, insertedMember.id, seasonId)
      })
    })

    season.fights.forEach((fight) => {
      const insertedFight = insertFight(db, seasonId, fight)

      fight.competitors.forEach((competitor) => {
        addBotToFight(db, insertedFight.id, competitor)
      })
    })
  })
}

export default async function createDb(
  data: Array<RawSeason>,
): Promise<DbInterface> {
  const SQL = await initSqlJs({
    locateFile: (file) => file,
  })

  const db = new SQL.Database()

  createTables(db)
  populateDatabase(db, data)

  return {
    getAllSeasons: () => {
      return getMany<DbSeason>(db, "SELECT * FROM seasons ORDER BY name")
    },
    getSeasonById: (id: string) => {
      return getOne<DbSeason>(db, "SELECT * FROM seasons WHERE id=:id", {
        ":id": id,
      })
    },
    getSeasonBots(id: string) {
      const sql = `
        SELECT
          b.id AS bot_id,
          b.name AS bot_name,
          s.name AS stage_name
        FROM season_bots sb
        INNER JOIN bots b ON sb.bot_id = b.id
        INNER JOIN stages s ON sb.stage_id = s.id
        WHERE sb.season_id=:id
        ORDER BY s.rank, b.name
      `

      const dbSeasonBots = getMany<DbSeasonBot>(db, sql, {
        ":id": id,
      })

      return dbSeasonBots.map((sb) => {
        return {
          botId: sb.bot_id,
          botName: sb.bot_name,
          stageName: sb.stage_name,
        }
      })
    },
    getSeasonFights(id: string) {
      const sql = `
        SELECT
          f.id,
          f.ko,
          s.name AS stage_name,
          b.name AS winner_name
        FROM fights f
        INNER JOIN stages s ON f.stage_id = s.id
        INNER JOIN bots b ON f.winner_id = b.id
        WHERE f.season_id=:id
        ORDER BY s.rank
      `

      const dbSeasonFights = getMany<DbSeasonFight>(db, sql, {
        ":id": id,
      })

      return dbSeasonFights.map((f) => {
        const competitors = getMany<{bot_name: string}>(
          db,
          `
            SELECT
              b.name AS bot_name
            FROM fight_competitors fc
            INNER JOIN bots b ON fc.bot_id = b.id
            WHERE fc.fight_id=:id
          `,
          {
            ":id": f.id,
          },
        )

        return {
          ko: f.ko === "true",
          stageName: f.stage_name,
          winnerName: f.winner_name,
          competitors: competitors.map((c) => c.bot_name),
        }
      })
    },
  }
}
