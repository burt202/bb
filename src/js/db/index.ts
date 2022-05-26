import initSqlJs from "sql.js"

import {
  DbBot,
  DbBotFight,
  DbBotSeason,
  DbCountryBot,
  DbInterface,
  DbMemberSeason,
  DbPrimaryWeaponTypeWinCountBreakdown,
  DbSeason,
  DbSeasonBot,
  DbSeasonFight,
  DbPrimaryWeaponType,
  DbTop10Result,
  RawSeason,
  SearchResult,
  DbPrimaryWeaponTypeWin,
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
      return getMany<DbSeason>(db, "SELECT * FROM seasons ORDER BY number ASC")
    },
    getSeasonById: (id: string) => {
      return getOne<DbSeason>(db, "SELECT * FROM seasons WHERE id = :id", {
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
        WHERE sb.season_id = :id
        ORDER BY s.rank ASC, b.name ASC
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
        WHERE f.season_id = :id
        ORDER BY s.rank ASC
      `

      const dbSeasonFights = getMany<DbSeasonFight>(db, sql, {
        ":id": id,
      })

      return dbSeasonFights.map((f) => {
        const bots = getMany<DbBot>(
          db,
          `
            SELECT
              b.id,
              b.name,
              b.country
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = :id
          `,
          {
            ":id": f.id,
          },
        )

        return {
          ko: f.ko === "true",
          stageName: f.stage_name,
          winnerName: f.winner_name,
          bots,
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
          s.year AS season_year,
          st.name AS stage_name,
          pwt.name AS primary_weapon_type
        FROM season_bots sb
        INNER JOIN seasons s ON sb.season_id = s.id
        INNER JOIN stages st ON sb.stage_id = st.id
        INNER JOIN season_bot_primary_weapon_types sbpwt
          ON sb.bot_id = sbpwt.bot_id
          AND sb.season_id = sbpwt.season_id
        INNER JOIN primary_weapon_types pwt ON sbpwt.primary_weapon_type_id = pwt.id
        WHERE sb.bot_id = :id
        ORDER BY s.number DESC
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
            ORDER BY bm.ordinal ASC
          `,
          {
            ":botId": id,
            ":seasonId": bs.season_id,
          },
        )

        return {
          members,
          seasonId: bs.season_id,
          seasonYear: bs.season_year,
          stageName: bs.stage_name,
          primaryWeaponType: bs.primary_weapon_type,
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
          s.year AS season_year
        FROM fight_bots fb
        INNER JOIN fights f ON fb.fight_id = f.id
        INNER JOIN stages st ON f.stage_id = st.id
        INNER JOIN seasons s ON f.season_id = s.id
        WHERE fb.bot_id = :id
        ORDER BY s.number DESC, st.rank ASC
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
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = :fightId
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
          seasonYear: f.season_year,
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
          s.year AS season_year,
          b.name AS bot_name,
          b.id AS bot_id
        FROM bot_members bm
        INNER JOIN bots b ON bm.bot_id = b.id
        INNER JOIN seasons s ON bm.season_id = s.id
        WHERE bm.member_id = :id
        ORDER BY s.number DESC
      `

      const dbMemberSeasons = getMany<DbMemberSeason>(db, sql, {
        ":id": id,
      })

      return dbMemberSeasons.map((ms) => {
        return {
          seasonId: ms.season_id,
          seasonYear: ms.season_year,
          botId: ms.bot_id,
          botName: ms.bot_name,
        }
      })
    },
    getTop10MostWins: (allTime) => {
      const lastThreeSeasonsWhere = allTime
        ? ""
        : `WHERE f.season_id IN (
        SELECT id FROM seasons ORDER BY id DESC LIMIT 3
      )`

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
          ${lastThreeSeasonsWhere}
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
    getTop10MostKOs: (allTime) => {
      const lastThreeSeasonsWhere = allTime
        ? ""
        : `AND f.season_id IN (
        SELECT id FROM seasons ORDER BY id DESC LIMIT 3
      )`

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
          ${lastThreeSeasonsWhere}
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
    getTop10BestWinPercentages: (allTime) => {
      const lastThreeSeasonsWhere = allTime
        ? ""
        : `WHERE f.season_id IN (
        SELECT id FROM seasons ORDER BY id DESC LIMIT 3
      )`

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
          ${lastThreeSeasonsWhere}
          GROUP BY winner_id
        ) AS wins ON b.id = wins.bot_id
        INNER JOIN (
          SELECT
            fb.bot_id AS bot_id,
            COUNT(fb.bot_id) AS count
          FROM fight_bots fb
          INNER JOIN fights f
          ON fb.fight_id = f.id
          ${lastThreeSeasonsWhere}
          GROUP BY fb.bot_id
        ) AS total ON b.id = total.bot_id
        WHERE total.count > 5
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
    getTop10BestKOPercentages: (allTime) => {
      const lastThreeSeasonsWhere = allTime
        ? ""
        : `f.season_id IN (
        SELECT id FROM seasons ORDER BY id DESC LIMIT 3
      )`

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
          ${
            lastThreeSeasonsWhere.length > 0
              ? `AND ${lastThreeSeasonsWhere}`
              : ""
          }
          GROUP BY winner_id
        ) AS kos ON b.id = kos.bot_id
        INNER JOIN (
          SELECT
            fb.bot_id AS bot_id,
            COUNT(fb.bot_id) AS count
          FROM fight_bots fb
          INNER JOIN fights f
          ON fb.fight_id = f.id
          ${
            lastThreeSeasonsWhere.length > 0
              ? `WHERE ${lastThreeSeasonsWhere}`
              : ""
          }
          GROUP BY fb.bot_id
        ) AS total ON b.id = total.bot_id
        WHERE total.count > 5
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
    getMostMatchesPlayed: () => {
      const sql = `
        SELECT
          b.id,
          b.name,
          b.country,
          count
        FROM bots b
        INNER JOIN (
          SELECT
            fb.bot_id AS bot_id,
            COUNT(fb.bot_id) AS count
          FROM fight_bots fb
          GROUP BY fb.bot_id
          ) AS total ON b.id = total.bot_id
          ORDER BY count DESC
          LIMIT 1
      `

      const getMostMatchesPlayed = getOne<DbBot>(db, sql) as DbBot

      return {
        id: getMostMatchesPlayed.id,
        name: getMostMatchesPlayed.name,
        country: getMostMatchesPlayed.country,
      }
    },
    getTotalBots: () => {
      const res = getOne<{count: number}>(
        db,
        "SELECT COUNT(*) AS count FROM bots",
      ) as {count: number}

      return res.count
    },
    getTotalFights: () => {
      const res = getOne<{count: number}>(
        db,
        "SELECT COUNT(*) AS count FROM fights",
      ) as {count: number}

      return res.count
    },
    search: (term: string) => {
      const sql = `
        SELECT
          b.id AS id,
          b.name AS name,
          'bot' AS type
        FROM bots b
        WHERE b.name LIKE :term
        UNION
        SELECT
          m.id AS id,
          m.name AS name,
          'member' AS type
        FROM members m
        WHERE m.name LIKE :term
      `

      return getMany<SearchResult>(db, sql, {
        ":term": `%${term}%`,
      })
    },
    getBotsForCountry: (id: string) => {
      const sql = `
        SELECT
          b.id AS id,
          b.name AS name,
          wins.count AS wins,
          total.count AS total_fights
        FROM bots b
        LEFT JOIN (
          SELECT
            f.winner_id AS bot_id,
            COUNT(f.winner_id) AS count
          FROM fights f
          GROUP BY winner_id
        ) AS wins ON b.id = wins.bot_id
        INNER JOIN (
          SELECT
            fb.bot_id AS bot_id,
            COUNT(fb.bot_id) AS count
          FROM fight_bots fb
          GROUP BY fb.bot_id
        ) AS total ON b.id = total.bot_id
        WHERE b.country = :id
        ORDER BY wins DESC
      `

      const dbCountryBots = getMany<DbCountryBot>(db, sql, {
        ":id": id.toUpperCase(),
      })

      return dbCountryBots.map((cb) => {
        return {
          id: cb.id,
          name: cb.name,
          wins: cb.wins ?? 0,
          totalFights: cb.total_fights,
        }
      })
    },
    getPrimaryWeaponTypeWinCountBreakdown: (seasonId) => {
      const seasonWhere = seasonId ? `WHERE f.season_id = '${seasonId}'` : ""

      const sql = `
        SELECT
          pwt.id,
          pwt.name,
          wins.count
        FROM primary_weapon_types pwt
        LEFT JOIN (
          SELECT
            sbpwt.primary_weapon_type_id,
            COUNT(*) AS count
          FROM fights f
          INNER JOIN season_bot_primary_weapon_types sbpwt
            ON f.winner_id = sbpwt.bot_id
            AND f.season_id = sbpwt.season_id
          ${seasonWhere}
          GROUP BY sbpwt.primary_weapon_type_id
        ) AS wins ON pwt.id = wins.primary_weapon_type_id
        ORDER BY wins.count DESC
      `

      return getMany<DbPrimaryWeaponTypeWinCountBreakdown>(db, sql).map(
        (pwt) => {
          let botCount = 0

          const innerSql = `
            SELECT COUNT(*) AS count
            FROM season_bot_primary_weapon_types sbpwt
            INNER JOIN primary_weapon_types pwt ON sbpwt.primary_weapon_type_id = pwt.id
            WHERE sbpwt.season_id = :seasonId
            AND pwt.id = :primaryWeaponTypeId
          `

          if (seasonId) {
            const res = getOne<{count: number}>(db, innerSql, {
              ":seasonId": seasonId,
              ":primaryWeaponTypeId": pwt.id,
            }) as {count: number}

            botCount = res.count
          }

          return {
            id: pwt.id,
            name: pwt.name,
            wins: pwt.count ?? 0,
            botCount,
          }
        },
      )
    },
    getAllPrimaryWeapons: () => {
      return getMany<DbPrimaryWeaponType>(
        db,
        "SELECT * FROM primary_weapon_types ORDER BY name ASC",
      )
    },
    getPrimaryWeaponTypeWins: (primaryWeaponTypeId, seasonId) => {
      const seasonWhere = seasonId ? `AND f.season_id = '${seasonId}'` : ""

      const sql = `
        SELECT
          f.id AS fight_id,
          f.ko,
          f.season_id,
          b.name AS winner_name,
          s.year AS season_year,
          st.name AS stage_name
        FROM fights f
        INNER JOIN bots b ON f.winner_id = b.id
        INNER JOIN seasons s ON f.season_id = s.id
        INNER JOIN stages st ON f.stage_id = st.id
        INNER JOIN season_bot_primary_weapon_types sbpwt
          ON f.winner_id = sbpwt.bot_id
          AND f.season_id = sbpwt.season_id
        WHERE sbpwt.primary_weapon_type_id = :primaryWeaponTypeId
          ${seasonWhere}
        ORDER BY f.season_id DESC, st.rank ASC
      `

      const primaryWeaponTypeWins = getMany<DbPrimaryWeaponTypeWin>(db, sql, {
        ":primaryWeaponTypeId": primaryWeaponTypeId,
      })

      return primaryWeaponTypeWins.map((f) => {
        const bots = getMany<DbBot>(
          db,
          `
            SELECT
              b.id,
              b.name,
              b.country
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = :id
          `,
          {
            ":id": f.fight_id,
          },
        )

        return {
          ko: f.ko === "true",
          seasonId: f.season_id,
          seasonYear: f.season_year,
          winnerName: f.winner_name,
          stageName: f.stage_name,
          bots,
        }
      })
    },
    getPrimaryWeaponTypeBots: (primaryWeaponTypeId, seasonId) => {
      const sql = `
        SELECT
          b.id AS bot_id,
          b.name AS bot_name,
          b.country AS bot_country,
          s.name AS stage_name
        FROM season_bots sb
        INNER JOIN bots b ON sb.bot_id = b.id
        INNER JOIN stages s ON sb.stage_id = s.id
        INNER JOIN season_bot_primary_weapon_types sbpwt
          ON b.id = sbpwt.bot_id AND sb.season_id = sbpwt.season_id
        WHERE sb.season_id = :seasonId
          AND sbpwt.primary_weapon_type_id = :primaryWeaponTypeId
        ORDER BY s.rank ASC, b.name DESC
      `

      const primaryWeaponTypeBots = getMany<DbSeasonBot>(db, sql, {
        ":primaryWeaponTypeId": primaryWeaponTypeId,
        ":seasonId": seasonId,
      })

      return primaryWeaponTypeBots.map((pwtb) => {
        return {
          botId: pwtb.bot_id,
          botName: pwtb.bot_name,
          botCountry: pwtb.bot_country,
          stageName: pwtb.stage_name,
        }
      })
    },
  }
}
