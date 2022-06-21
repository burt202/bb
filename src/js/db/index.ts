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
  DbPrimaryWeaponType,
  DbTop10Result,
  RawSeason,
  SearchResult,
  DbPrimaryWeaponTypeWin,
  DbCompetition,
  DbCompetitionFight,
  DbCompetitionBot,
  DbSeasonCompetition,
  Bot,
  Member,
  DbMember,
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
    getCompetitionsForSeason: (id: string) => {
      return getMany<DbCompetition>(
        db,
        "SELECT * FROM competitions WHERE season_id = :id",
        {
          ":id": id,
        },
      )
    },
    getCompetitionBots(id: string) {
      const sql = `
        SELECT
          b.id AS bot_id,
          b.name AS bot_name,
          b.country AS bot_country,
          (
            SELECT
              CASE
                WHEN (s.name = 'final' OR s.name = 'bounty') AND f.winner_id = b.id
                THEN 'winner'
                ELSE s.name
              END
            FROM fights f
            INNER JOIN fight_bots fb ON f.id = fb.fight_id
            INNER JOIN stages s ON f.stage_id = s.id
            WHERE f.competition_id = :id AND fb.bot_id = b.id
            ORDER BY s.rank ASC LIMIT 1
          ) AS stage_name
        FROM bots b
        INNER JOIN stages s ON stage_name = s.name
        WHERE b.id IN (
          SELECT
            DISTINCT fb.bot_id
          FROM fight_bots fb
          INNER JOIN fights f ON fb.fight_id = f.id
          INNER JOIN bots b ON fb.bot_id = b.id
          WHERE f.competition_id = :id
        )
        ORDER BY s.rank ASC
      `

      const dbCompetitionBots = getMany<DbCompetitionBot>(db, sql, {
        ":id": id,
      })

      return dbCompetitionBots.map((cb) => {
        return {
          botId: cb.bot_id,
          botName: cb.bot_name,
          botCountry: cb.bot_country,
          stageName: cb.stage_name,
        }
      })
    },
    getCompetitionFights(id: string) {
      const sql = `
        SELECT
          f.id,
          f.ko,
          s.name AS stage_name,
          b.name AS winner_name,
          (
            SELECT
              json_group_array(
                json_object(
                  'id', b.id,
                  'name', b.name,
                  'country', b.country
                )
              )
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = f.id
          ) AS bots
        FROM fights f
        INNER JOIN stages s ON f.stage_id = s.id
        INNER JOIN bots b ON f.winner_id = b.id
        WHERE f.competition_id = :id
        ORDER BY s.rank ASC
      `

      const dbCompetitionFights = getMany<DbCompetitionFight>(db, sql, {
        ":id": id,
      })

      return dbCompetitionFights.map((f) => {
        return {
          ko: f.ko === "true",
          stageName: f.stage_name,
          winnerName: f.winner_name,
          bots: JSON.parse(f.bots) as Array<Bot>,
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
          s.number AS season_number,
          pwt.name AS primary_weapon_type,
          (
            SELECT
              json_group_array(
                json_object(
                  'id', m.id,
                  'name', m.name,
                  'ordinal', bm.ordinal
                )
              )
            FROM bot_members bm
            INNER JOIN members m ON bm.member_id = m.id
            WHERE bm.bot_id = :id
            AND bm.season_id = s.id
          ) AS members,
          (
            SELECT
              COUNT(f.winner_id) AS count
            FROM fights f
            INNER JOIN competitions c ON f.competition_id = c.id
            INNER JOIN seasons ON c.season_id = s.id
            WHERE f.winner_id = :id
            AND seasons.year = s.year
          ) AS wins
        FROM season_bots sb
        INNER JOIN seasons s ON sb.season_id = s.id
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
        return {
          members: JSON.parse(bs.members) as Array<Member>,
          seasonId: bs.season_id,
          seasonYear: bs.season_year,
          seasonNumber: bs.season_number,
          primaryWeaponType: bs.primary_weapon_type,
          wins: bs.wins,
        }
      })
    },
    getBotCompetitions(id: string) {
      const competitions = getMany<DbSeasonCompetition>(
        db,
        `
          SELECT
            DISTINCT
              s.id AS season_id,
              s.year AS season_year,
              s.number AS season_number,
              c.id AS competition_id,
              c.name AS competition_name,
              (
                SELECT
                  CASE
                    WHEN (s.name = 'final' OR s.name = 'bounty') AND f.winner_id = :id
                    THEN 'winner'
                    ELSE s.name
                  END AS stage_name
                FROM fights f
                INNER JOIN fight_bots fb ON f.id = fb.fight_id
                INNER JOIN stages s ON f.stage_id = s.id
                WHERE f.competition_id = c.id AND fb.bot_id = :id
                ORDER BY s.rank ASC LIMIT 1
              ) AS stage_name
          FROM fight_bots fb
          INNER JOIN fights f ON fb.fight_id = f.id
          INNER JOIN competitions c ON f.competition_id = c.id
          INNER JOIN seasons s ON c.season_id = s.id
          WHERE fb.bot_id = :id
          ORDER BY s.number DESC
        `,
        {
          ":id": id,
        },
      )

      return competitions.map((c) => {
        return {
          seasonId: c.season_id,
          seasonYear: c.season_year,
          seasonNumber: c.season_number,
          competitionId: c.competition_id,
          competitionName: c.competition_name,
          stageName: c.stage_name,
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
          s.year AS season_year,
          s.number AS season_number,
          c.id AS competition_id,
          c.name AS competition_name,
          (
            SELECT
              json_group_array(
                json_object(
                  'id', b.id,
                  'name', b.name,
                  'country', b.country
                )
              )
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = f.id
            AND b.id != :id
          ) AS against
        FROM fight_bots fb
        INNER JOIN fights f ON fb.fight_id = f.id
        INNER JOIN stages st ON f.stage_id = st.id
        INNER JOIN competitions c ON f.competition_id = c.id
        INNER JOIN seasons s ON c.season_id = s.id
        WHERE fb.bot_id = :id
        ORDER BY s.number DESC, c.name ASC, st.rank ASC
      `

      const dbBotFights = getMany<DbBotFight>(db, sql, {
        ":id": id,
      })

      return dbBotFights.map((f) => {
        return {
          ko: f.ko === "true",
          winnerId: f.winner_id,
          stageName: f.stage_name,
          seasonId: f.season_id,
          seasonNumber: f.season_number,
          competitionId: f.competition_id,
          competitionName: f.competition_name,
          seasonYear: f.season_year,
          against: JSON.parse(f.against) as Array<Bot>,
        }
      })
    },
    getMemberById: (id: string) => {
      return getOne<DbMember>(db, "SELECT * FROM members WHERE id = :id", {
        ":id": id,
      })
    },
    getMemberSeasons: (id: string) => {
      const sql = `
        SELECT
          s.id AS season_id,
          s.year AS season_year,
          s.number AS season_number,
          b.name AS bot_name,
          b.id AS bot_id,
          (
            SELECT
              COUNT(f.winner_id) AS count
            FROM fights f
            INNER JOIN competitions c ON f.competition_id = c.id
            INNER JOIN seasons ON c.season_id = s.id
            WHERE f.winner_id = b.id
            AND seasons.year = s.year
          ) AS wins
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
          seasonNumber: ms.season_number,
          botId: ms.bot_id,
          botName: ms.bot_name,
          wins: ms.wins,
        }
      })
    },
    getTop10MostWins: (allTime) => {
      const lastThreeSeasonsWhere = allTime
        ? ""
        : `WHERE f.competition_id IN (
            SELECT id FROM competitions WHERE season_id IN (
              SELECT id FROM seasons ORDER BY id DESC LIMIT 3
            )
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
        : `AND f.competition_id IN (
            SELECT id FROM competitions WHERE season_id IN (
              SELECT id FROM seasons ORDER BY id DESC LIMIT 3
            )
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
        : `WHERE f.competition_id IN (
            SELECT id FROM competitions WHERE season_id IN (
              SELECT id FROM seasons ORDER BY id DESC LIMIT 3
            )
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
        : `f.competition_id IN (
            SELECT id FROM competitions WHERE season_id IN (
              SELECT id FROM seasons ORDER BY id DESC LIMIT 3
            )
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
      const seasonWhere = seasonId ? `WHERE c.season_id = '${seasonId}'` : ""

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
          INNER JOIN competitions c ON f.competition_id = c.id
          INNER JOIN season_bot_primary_weapon_types sbpwt
            ON f.winner_id = sbpwt.bot_id
            AND c.season_id = sbpwt.season_id
          ${seasonWhere}
          GROUP BY sbpwt.primary_weapon_type_id
        ) AS wins ON pwt.id = wins.primary_weapon_type_id
        ORDER BY wins.count DESC
      `

      return getMany<DbPrimaryWeaponTypeWinCountBreakdown>(db, sql).map(
        (pwt) => {
          let botCount = 0

          if (seasonId) {
            const innerSql = `
              SELECT COUNT(*) AS count
              FROM season_bot_primary_weapon_types sbpwt
              INNER JOIN primary_weapon_types pwt ON sbpwt.primary_weapon_type_id = pwt.id
              WHERE sbpwt.season_id = :seasonId
              AND pwt.id = :primaryWeaponTypeId
            `

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
      const seasonWhere = seasonId ? `AND c.season_id = '${seasonId}'` : ""

      const sql = `
        SELECT
          f.id AS fight_id,
          f.ko,
          c.season_id,
          b.name AS winner_name,
          s.year AS season_year,
          s.number AS season_number,
          c.id AS competition_id,
          c.name AS competition_name,
          st.name AS stage_name,
          (
            SELECT
              json_group_array(
                json_object(
                  'id', b.id,
                  'name', b.name,
                  'country', b.country
                )
              )
            FROM fight_bots fb
            INNER JOIN bots b ON fb.bot_id = b.id
            WHERE fb.fight_id = f.id
          ) AS bots
        FROM fights f
        INNER JOIN bots b ON f.winner_id = b.id
        INNER JOIN competitions c ON f.competition_id = c.id
        INNER JOIN seasons s ON c.season_id = s.id
        INNER JOIN stages st ON f.stage_id = st.id
        INNER JOIN season_bot_primary_weapon_types sbpwt
          ON f.winner_id = sbpwt.bot_id
          AND c.season_id = sbpwt.season_id
        WHERE sbpwt.primary_weapon_type_id = :primaryWeaponTypeId
          ${seasonWhere}
        ORDER BY s.number DESC, c.name ASC, st.rank ASC
      `

      const primaryWeaponTypeWins = getMany<DbPrimaryWeaponTypeWin>(db, sql, {
        ":primaryWeaponTypeId": primaryWeaponTypeId,
      })

      return primaryWeaponTypeWins.map((f) => {
        return {
          ko: f.ko === "true",
          seasonId: f.season_id,
          seasonYear: f.season_year,
          seasonNumber: f.season_number,
          competitionId: f.competition_id,
          competitionName: f.competition_name,
          winnerName: f.winner_name,
          stageName: f.stage_name,
          bots: JSON.parse(f.bots) as Array<DbBot>,
        }
      })
    },
    getPrimaryWeaponTypeBots: (primaryWeaponTypeId, seasonId) => {
      const sql = `
        SELECT
          b.id AS bot_id,
          b.name AS bot_name,
          b.country AS bot_country
        FROM season_bots sb
        INNER JOIN bots b ON sb.bot_id = b.id
        INNER JOIN season_bot_primary_weapon_types sbpwt
          ON b.id = sbpwt.bot_id AND sb.season_id = sbpwt.season_id
        WHERE sb.season_id = :seasonId
          AND sbpwt.primary_weapon_type_id = :primaryWeaponTypeId
        ORDER BY b.name ASC
      `

      const primaryWeaponTypeBots = getMany<DbCompetitionBot>(db, sql, {
        ":primaryWeaponTypeId": primaryWeaponTypeId,
        ":seasonId": seasonId,
      })

      return primaryWeaponTypeBots.map((pwtb) => {
        const competitions = getMany<DbSeasonCompetition>(
          db,
          `
            SELECT
              DISTINCT
                s.id AS season_id,
                s.year AS season_year,
                s.number AS season_number,
                c.id AS competition_id,
                c.name AS competition_name
            FROM fight_bots fb
            INNER JOIN fights f ON fb.fight_id = f.id
            INNER JOIN competitions c ON f.competition_id = c.id
            INNER JOIN seasons s ON c.season_id = s.id
            WHERE fb.bot_id = :botId
            AND c.season_id = :seasonId
          `,
          {
            ":botId": pwtb.bot_id,
            ":seasonId": seasonId,
          },
        )

        return {
          botId: pwtb.bot_id,
          botName: pwtb.bot_name,
          botCountry: pwtb.bot_country,
          competitions: competitions.map((c) => {
            return {
              seasonId: c.season_id,
              seasonYear: c.season_year,
              seasonNumber: c.season_number,
              competitionId: c.competition_id,
              competitionName: c.competition_name,
            }
          }),
        }
      })
    },
  }
}
