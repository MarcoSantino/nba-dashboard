export interface Conference {
    name: string;
    nickname: string;
    logo: string;
    teamId: string;
    confName: string;
    divName: string;
    shortName: string;
}

export interface Store {
    seasons: string[];
    seasonSelected: string;
    westConference: Conference[];
    eastConference: Conference[];
}