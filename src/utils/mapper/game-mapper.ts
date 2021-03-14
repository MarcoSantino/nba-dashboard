import { Conference } from "../../interfaces/redux/store";
import { Statistic, StatisticMapped } from "../../interfaces/services/response/get-game-detail";

export function statisticMapper(statistic: Statistic, team: Conference | undefined): StatisticMapped {
    return {
        points: statistic.points,
        steals: statistic.steals,
        assists: statistic.assists,
        blocks: statistic.blocks,
        rebounds: statistic.totReb,
        logo: team?.logo,
        name: team?.name,
        teamId: team?.teamId
    }
}