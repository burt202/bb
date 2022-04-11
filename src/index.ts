import initSqlJs from "sql.js"
import * as uuid from "uuid"

const data = {
  2015: require("../data/2015.json"),
}

// todo add rank/progress to bots
// luke ewert, reece ewert

const allData = Object.values(data)

initSqlJs({
  locateFile: (file) => file,
}).then(function (SQL) {
  const db = new SQL.Database()

  // seasons, bots, members, matches, match_types

  db.run(`
    CREATE TABLE seasons (id text, season text);
    CREATE TABLE match_types (id text, name text, rank int);
  `)

  allData.forEach((d) => {
    db.run("INSERT INTO seasons VALUES (?,?)", [uuid.v4(), d.year])
  })

  db.run(`
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'final', 1);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'semi', 2);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'quarter', 3);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'roundof16', 4);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'roundof32', 5);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'qualifier', 6);
    INSERT INTO match_types VALUES ('${uuid.v4()}', 'season', 6);
  `)

  const seasons = db.exec("SELECT * FROM seasons")
  console.log("seasons", seasons)

  const matchTypes = db.exec("SELECT * FROM match_types")
  console.log("matchTypes", matchTypes)
})
