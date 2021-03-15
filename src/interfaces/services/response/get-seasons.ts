export interface Api {
	status: number;
	message: string;
	results: number;
	filters: string[];
	seasons: string[];
}

export interface GetSeasons {
	api: Api;
}