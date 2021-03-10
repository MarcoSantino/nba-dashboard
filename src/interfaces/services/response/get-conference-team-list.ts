export interface Standard {
	confName: string;
	divName: string;
}

export interface League {
	standard: Standard;
}

export interface Team {
	city: string;
	fullName: string;
	teamId: string;
	nickname: string;
	logo: string;
	shortName: string;
	allStar: string;
	nbaFranchise: string;
	leagues: League;
}

export interface Api {
	status: number;
	message: string;
	results: number;
	filters: string[];
	teams: Team[];
}

export interface GetConferenceTeamList {
	api: Api;
}