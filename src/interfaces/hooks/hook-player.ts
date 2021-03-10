import { PlayerMapped } from "../services/response/get-players";

export interface HookPlayer {
    players: PlayerMapped[];
    set: (players: PlayerMapped[]) => void;
}
