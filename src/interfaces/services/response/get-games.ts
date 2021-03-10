export interface Score {
    points: string;
}

export interface VTeam {
    teamId: string;
    shortName: string;
    fullName: string;
    nickName: string;
    logo: string;
    score: Score;
}

export interface Score {
    points: string;
}

export interface HTeam {
    teamId: string;
    shortName: string;
    fullName: string;
    nickName: string;
    logo: string;
    score: Score;
}

export interface Game {
    seasonYear: string;
    league: string;
    gameId: string;
    startTimeUTC: string;
    endTimeUTC: string;
    arena: string;
    city: string;
    country: string;
    clock: string;
    gameDuration: string;
    currentPeriod: string;
    halftime: string;
    endOfPeriod: string;
    seasonStage: string;
    statusShortGame: string;
    statusGame: string;
    vTeam: VTeam;
    hTeam: HTeam;
}

export interface Api {
    status: number;
    message: string;
    results: number;
    filters: string[];
    games: Game[];
}

export interface GetGames {
    api: Api;
}

export interface Team {
    isCurrent: boolean;
    isWinner: boolean;
    logo: string;
    name: string;
}

export interface GameMapped {
    arena: string;
    city: string;
    points: string;
    game: string;
    year: string;
    gameId: string;
    home: Team;
    away: Team;
}
