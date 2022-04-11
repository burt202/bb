import initSqlJs, {Database} from "sql.js"
import * as uuid from "uuid"

interface Season {
  year: number
  bots: Array<{name: string; keyMembers: Array<string>; progress: string}>
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

function getMatchTypeByName(db: Database, name: string) {
  const stmt = db.prepare("SELECT * FROM match_types WHERE name=:name")
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
  progress: string,
) {
  const matchType = getMatchTypeByName(db, progress)

  if (matchType === undefined) {
    throw new Error(`Cannot find match_type: ${progress}`)
  }

  db.run("INSERT INTO season_bots VALUES (?,?,?)", [
    seasonId,
    botId,
    matchType.id,
  ])
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

initSqlJs({
  locateFile: (file) => file,
}).then(function (SQL) {
  const db = new SQL.Database()

  // matches, matches_link
  // todo add rank/progress to bots
  // luke ewert, reece ewert

  db.run(`
    CREATE TABLE seasons (
      id text UNIQUE,
      season text UNIQUE,
      primary key (id)
    );

    CREATE TABLE match_types (
      id text UNIQUE,
      name text UNIQUE,
      rank int,
      primary key (id)
    );

    CREATE TABLE bots (
      id text UNIQUE,
      name text UNIQUE,
      primary key (id)
    );

    CREATE TABLE members (
      id text UNIQUE,
      name text UNIQUE,
      primary key (id)
    );

    CREATE TABLE season_bots (
      season_id text,
      bot_id text,
      match_type_id text,
      primary key (season_id, bot_id),
      foreign key (season_id) references seasons(id),
      foreign key (bot_id) references bots(id),
      foreign key (match_type_id) references match_types(id)
    );

    CREATE TABLE bot_members (
      bot_id text,
      member_id text,
      season_id text,
      primary key (member_id, season_id),
      foreign key (bot_id) references bots(id),
      foreign key (member_id) references members(id),
      foreign key (season_id) references seasons(id)
    );

    CREATE TABLE matches (
      id text UNIQUE,
      ko bool,
      match_type_id text,
      winner_id text,
      primary key (id),
      foreign key (winner_id) references bots(id),
      foreign key (match_type_id) references match_types(id)
    );

    CREATE TABLE match_competitors (
      match_id text,
      bot_id text,
      primary key (match_id, bot_id),
      foreign key (match_id) references matches(id),
      foreign key (bot_id) references bots(id)
    );
  `)

  db.run(`
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'final', 1);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'semi', 2);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'quarter', 3);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'roundof16', 4);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'roundof32', 5);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'qualifier', 6);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'season', 6);
  `)

  allData.forEach((season) => {
    const seasonId = uuid.v4()
    db.run("INSERT INTO seasons VALUES (?,?)", [seasonId, season.year])

    season.bots.forEach((bot) => {
      const insertedBot = insertBot(db, bot.name)
      addBotToSeason(db, seasonId, insertedBot.id, bot.progress)

      bot.keyMembers.forEach((member) => {
        const insertedMember = insertMember(db, member)
        addMemberToBotForSeason(db, insertedBot.id, insertedMember.id, seasonId)
      })
    })
  })
})
