export interface Conference {
    name: string;
    rank: string;
    win: string;
    loss: string;
}

export interface Division {
    name: string;
    rank: string;
    win: string;
    loss: string;
    gamesBehind: string;
}

export interface Home {
    win: string;
    loss: string;
}

export interface Away {
    win: string;
    loss: string;
}

export interface Standing {
    league: string;
    teamId: string;
    win: string;
    loss: string;
    gamesBehind: string;
    lastTenWin: string;
    lastTenLoss: string;
    streak: string;
    seasonYear: string;
    conference: Conference;
    division: Division;
    winPercentage: string;
    lossPercentage: string;
    home: Home;
    away: Away;
    winStreak: string;
    tieBreakerPoints: string;
}

export interface Api {
    status: number;
    message: string;
    results: number;
    filters: string[];
    standings: Standing[];
}

export interface GetStandings {
    api: Api;
}

export interface StandingMapped {
    year: string;
    away: Away;
    home: Home;
    conferenceRank: string;
    conferenceName: string;
    divisionRank: string;
    divisionName: string;
    totalWin: string;
    totalLoss: string;
}