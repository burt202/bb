import initSqlJs, {Database} from "sql.js"
import * as uuid from "uuid"

interface Bot {
  name: string
  keyMembers: Array<string>
  stage: string
}

interface Fight {
  competitors: Array<string>
  winner: string
  stage: string
  ko: boolean
}

interface Season {
  year: number
  bots: Array<Bot>
  fights: Array<Fight>
}

const data = {
  2015: require("../data/2015.json") as Season,
}

const allData = Object.values(data)

function insertBot(db: Database, name: string) {
  const stmt = db.prepare("SELECT * FROM bots WHERE name=:name")
  const result = stmt.get({":name": name})
  stmt.free()

  if (result.length === 0) {
    const id = uuid.v4()
    db.run("INSERT INTO bots VALUES (?,?)", [id, name])
    return {id, name}
  }

  return {id: result[0], name: result[1]} as {id: string; name: string}
}

function getStageByName(db: Database, name: string) {
  const stmt = db.prepare("SELECT * FROM stages WHERE name=:name")
  const result = stmt.get({":name": name})
  stmt.free()

  if (result.length === 0) {
    return undefined
  }

  return {id: result[0], name: result[1]} as {id: string; name: string}
}

function getBotByName(db: Database, name: string) {
  const stmt = db.prepare("SELECT * FROM bots WHERE name=:name")
  const result = stmt.get({":name": name})
  stmt.free()

  if (result.length === 0) {
    return undefined
  }

  return {id: result[0], name: result[1]} as {id: string; name: string}
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
  const stmt = db.prepare("SELECT * FROM members WHERE name=:name")
  const result = stmt.get({":name": name})
  stmt.free()

  if (result.length === 0) {
    const id = uuid.v4()
    db.run("INSERT INTO members VALUES (?,?)", [id, name])
    return {id, name}
  }

  return {id: result[0], name: result[1]} as {id: string; name: string}
}

function addMemberToBotForSeason(
  db: Database,
  botId: string,
  memberId: string,
  seasonId: string,
) {
  db.run("INSERT INTO bot_members VALUES (?,?,?)", [botId, memberId, seasonId])
}

function insertFight(db: Database, seasonId: string, fight: Fight) {
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

initSqlJs({
  locateFile: (file) => file,
}).then(function (SQL) {
  const db = new SQL.Database()

  // bot type, nation

  db.run(`
    CREATE TABLE seasons (
      id text UNIQUE NOT NULL,
      season text UNIQUE NOT NULL,
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

  db.run(`
    INSERT INTO stages VALUES ('${uuid.v4()}', 'final', 1);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'semi', 2);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'quarter', 3);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'roundof16', 4);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'roundof32', 5);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'qualifier', 6);
    INSERT INTO stages VALUES ('${uuid.v4()}', 'season', 6);
  `)

  allData.forEach((season) => {
    const seasonId = uuid.v4()
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

  const botMembers = db.exec("SELECT * FROM bot_members")
  console.log("botMembers", botMembers)
})
