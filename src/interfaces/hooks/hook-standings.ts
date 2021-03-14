import { StandingMapped } from "../services/response/get-standings";

export interface HookStandings {
    standings: StandingMapped[];
    set: (games: StandingMapped[]) => void;
}
