import initSqlJs from "sql.js"
import {
  DbBot,
  DbBotFight,
  DbBotSeason,
  DbInterface,
  DbMemberSeason,
  DbSeason,
  DbSeasonBot,
  DbSeasonFight,
  DbTop10Result,
  RawSeason,
} from "../types"
import {createTables, populateDatabase, getMany, getOne} from "./helpers"

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
          b.country AS bot_country,
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
          botCountry: sb.bot_country,
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
        const competitors = getMany<DbBot>(
          db,
          `
            SELECT
              b.id,
              b.name,
              b.country
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
          competitors: competitors,
        }
      })
    },
    getBotById: (id: string) => {
      return getOne<DbBot>(db, "SELECT * FROM bots WHERE id = :id", {
        ":id": id,
      })
    },
    getBotSeasons: (id: string) => {
      const sql = `
        SELECT
          s.id AS season_id,
          s.name AS season_name,
          st.name AS stage_name
        FROM season_bots sb
        INNER JOIN seasons s ON sb.season_id = s.id
        INNER JOIN stages st ON sb.stage_id = st.id
        WHERE sb.bot_id = :id
        ORDER BY s.id DESC
      `

      const dbBotSeasons = getMany<DbBotSeason>(db, sql, {
        ":id": id,
      })

      return dbBotSeasons.map((bs) => {
        const members = getMany<{id: string; name: string}>(
          db,
          `
            SELECT
              m.id,
              m.name
            FROM bot_members bm
            INNER JOIN members m ON bm.member_id = m.id
            WHERE bm.bot_id = :botId
            AND bm.season_id = :seasonId
          `,
          {
            ":botId": id,
            ":seasonId": bs.season_id,
          },
        )

        return {
          members,
          seasonId: bs.season_id,
          seasonName: bs.season_name,
          stageName: bs.stage_name,
        }
      })
    },
    getBotFights(id: string) {
      const sql = `
        SELECT
          f.id,
          f.ko,
          f.winner_id,
          st.name AS stage_name,
          s.id AS season_id,
          s.name AS season_name
        FROM fight_competitors fc
        INNER JOIN fights f ON fc.fight_id = f.id
        INNER JOIN stages st ON f.stage_id = st.id
        INNER JOIN seasons s ON f.season_id = s.id
        WHERE fc.bot_id = :id
        ORDER BY f.season_id DESC, st.rank
      `

      const dbBotFights = getMany<DbBotFight>(db, sql, {
        ":id": id,
      })

      return dbBotFights.map((f) => {
        const against = getMany<DbBot>(
          db,
          `
            SELECT
              b.id,
              b.name,
              b.country
            FROM fight_competitors fc
            INNER JOIN bots b ON fc.bot_id = b.id
            WHERE fc.fight_id = :fightId
            AND b.id != :botId
          `,
          {
            ":fightId": f.id,
            ":botId": id,
          },
        )

        return {
          ko: f.ko === "true",
          winnerId: f.winner_id,
          stageName: f.stage_name,
          seasonId: f.season_id,
          seasonName: f.season_name,
          against,
        }
      })
    },
    getMemberById: (id: string) => {
      return getOne<DbBot>(db, "SELECT * FROM members WHERE id = :id", {
        ":id": id,
      })
    },
    getMemberSeasons: (id: string) => {
      const sql = `
        SELECT
          s.id AS season_id,
          s.name AS season_name,
          b.name AS bot_name,
          b.id AS bot_id
        FROM bot_members bm
        INNER JOIN bots b ON bm.bot_id = b.id
        INNER JOIN seasons s ON bm.season_id = s.id
        WHERE bm.member_id = :id
        ORDER BY s.id DESC
      `

      const dbMemberSeasons = getMany<DbMemberSeason>(db, sql, {
        ":id": id,
      })

      return dbMemberSeasons.map((ms) => {
        return {
          seasonId: ms.season_id,
          seasonName: ms.season_name,
          botId: ms.bot_id,
          botName: ms.bot_name,
        }
      })
    },
    getTop10MostWins: () => {
      const sql = `
        SELECT
          b.name AS bot_name,
          sq.bot_id,
          sq.count
        FROM bots b
        INNER JOIN (
          SELECT
            f.winner_id AS bot_id,
            COUNT(f.winner_id) AS count
          FROM fights f
          GROUP BY f.winner_id
          ORDER BY count DESC
          LIMIT 10
        ) AS sq ON b.id = sq.bot_id
      `
      const top10MostWins = getMany<DbTop10Result>(db, sql)

      return top10MostWins.map((tt) => {
        return {
          count: tt.count,
          botId: tt.bot_id,
          botName: tt.bot_name,
        }
      })
    },
    getTop10MostKOs: () => {
      const sql = `
        SELECT
          b.name AS bot_name,
          sq.bot_id,
          sq.count
        FROM bots b
        INNER JOIN (
          SELECT
            f.winner_id AS bot_id,
            COUNT(f.winner_id) AS count
          FROM fights f
          WHERE f.ko = 'true'
          GROUP BY f.winner_id
          ORDER BY count DESC
          LIMIT 10
        ) AS sq ON b.id = sq.bot_id
      `
      const top10MostWins = getMany<DbTop10Result>(db, sql)

      return top10MostWins.map((tt) => {
        return {
          count: tt.count,
          botId: tt.bot_id,
          botName: tt.bot_name,
        }
      })
    },
    getTop10BestWinPercentages: () => {
      const sql = `
        SELECT
          b.name AS bot_name,
          wins.bot_id,
          1.0 * wins.count / total.count AS count
        FROM bots b
        INNER JOIN (
          SELECT
            f.winner_id AS bot_id,
            COUNT(f.winner_id) AS count
          FROM fights f
          GROUP BY winner_id
        ) AS wins ON b.id = wins.bot_id
        INNER JOIN (
          SELECT
            fc.bot_id AS bot_id,
            COUNT(fc.bot_id) AS count
          FROM fight_competitors fc
          GROUP BY fc.bot_id
        ) AS total ON b.id = total.bot_id
        WHERE total.count >= 3
        ORDER BY count DESC
        LIMIT 10
      `
      const getTop10BestWinPercentages = getMany<DbTop10Result>(db, sql)

      return getTop10BestWinPercentages.map((tt) => {
        return {
          count: tt.count,
          botId: tt.bot_id,
          botName: tt.bot_name,
        }
      })
    },
    getTop10BestKOPercentages: () => {
      const sql = `
        SELECT
          b.name AS bot_name,
          kos.bot_id,
          1.0 * kos.count / total.count AS count
        FROM bots b
        INNER JOIN (
          SELECT
            f.winner_id AS bot_id,
            COUNT(f.winner_id) AS count
          FROM fights f
          WHERE f.ko = 'true'
          GROUP BY winner_id
        ) AS kos ON b.id = kos.bot_id
        INNER JOIN (
          SELECT
            fc.bot_id AS bot_id,
            COUNT(fc.bot_id) AS count
          FROM fight_competitors fc
          GROUP BY fc.bot_id
        ) AS total ON b.id = total.bot_id
        WHERE total.count >= 3
        ORDER BY count DESC
        LIMIT 10
      `
      const getTop10BestKOPercentages = getMany<DbTop10Result>(db, sql)

      return getTop10BestKOPercentages.map((tt) => {
        return {
          count: tt.count,
          botId: tt.bot_id,
          botName: tt.bot_name,
        }
      })
    },
  }
}
