export interface Statistic {
    gameId: string;
    teamId: string;
    fastBreakPoints: string;
    pointsInPaint: string;
    biggestLead: string;
    secondChancePoints: string;
    pointsOffTurnovers: string;
    longestRun: string;
    points: string;
    fgm: string;
    fga: string;
    fgp: string;
    ftm: string;
    fta: string;
    ftp: string;
    tpm: string;
    tpa: string;
    tpp: string;
    offReb: string;
    defReb: string;
    totReb: string;
    assists: string;
    pFouls: string;
    steals: string;
    turnovers: string;
    blocks: string;
    plusMinus: string;
    min: string;
}

export interface Api {
    status: number;
    message: string;
    results: number;
    filters: string[];
    statistics: Statistic[];
}

export interface GetGameDetail {
    api: Api;
}

export interface StatisticMapped {
    points: string;
    steals: string;
    assists: string;
    blocks: string;
    rebounds: string;
    logo: string | undefined;
    name: string | undefined;
    teamId: string | undefined;
}
