export interface Standard {
    jersey: string;
    active: string;
    pos: string;
}

export interface League {
    standard: Standard;
}

export interface Player {
    firstName: string;
    lastName: string;
    teamId: string;
    yearsPro: string;
    collegeName: string;
    country: string;
    playerId: string;
    dateOfBirth: string;
    affiliation: string;
    startNba: string;
    heightInMeters: string;
    weightInKilograms: string;
    leagues: League;
}

export interface Api {
    status: number;
    message: string;
    results: number;
    filters: string[];
    players: Player[];
}

export interface GetPlayers {
    api: Api;
}

export interface PlayerMapped {
    fullName: string;
    birthDate: string;
    isActive: boolean;
    jersey: string;
    position: string;
}