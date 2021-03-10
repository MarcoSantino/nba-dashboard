export interface Api {
	status: number;
	message: string;
	results: number;
	filters: any[];
	seasons: string[];
}

export interface GetSeasons {
	api: Api;
}