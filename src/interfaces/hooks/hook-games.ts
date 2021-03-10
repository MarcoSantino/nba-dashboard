import { GameMapped } from "../services/response/get-games";

export interface HookGames {
    games: GameMapped[];
    set: (games: GameMapped[]) => void;
}
