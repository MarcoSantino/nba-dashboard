import { StatisticMapped } from "../services/response/get-game-detail";

export interface HookStatisticData {
    awayStatistic: StatisticMapped;
    homeStatistic: StatisticMapped;
}

export interface HookStatistic {
    statistics: HookStatisticData;
    set: (statistics: HookStatisticData) => void;
}
