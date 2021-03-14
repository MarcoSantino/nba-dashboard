import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { HookConference } from "../interfaces/hooks/hook-conference";
import { HookError } from "../interfaces/hooks/hook-error";
import { HookGames } from "../interfaces/hooks/hook-games";
import { HookLoaded } from "../interfaces/hooks/hook-loaded";
import { HookPlayer } from "../interfaces/hooks/hook-player";
import { HookRetry } from "../interfaces/hooks/hook-retry";
import { HookSearch } from "../interfaces/hooks/hook-search";
import { HookStandings } from "../interfaces/hooks/hook-standings";
import { HookStatistic, HookStatisticData } from "../interfaces/hooks/hook-statistic";
import { HookStatsHomepage } from "../interfaces/hooks/hook-stats-homepage";
import { Conference } from "../interfaces/redux/store";
import { StatisticMapped } from "../interfaces/services/response/get-game-detail";
import { GameMapped } from "../interfaces/services/response/get-games";
import { PlayerMapped } from "../interfaces/services/response/get-players";
import { StandingMapped } from "../interfaces/services/response/get-standings";

export function useError(): HookError {
    const [error, setError]: [string, Dispatch<SetStateAction<string>>] = useState('' as string);

    const set = useCallback((err: string) => setError(() => err), []);

    return { error, set };
}
export function useConference(): HookConference {
    const [conference, setError]: [Conference[], Dispatch<SetStateAction<Conference[]>>] = useState([] as Conference[]);

    const set = useCallback((conference: Conference[]) => setError(() => conference), []);

    return { conference, set };
}
export function useLoaded(): HookLoaded {
    const [isLoaded, setIsLoaded]: [boolean, Dispatch<SetStateAction<boolean>>] = useState((false as boolean));

    const set = useCallback((isLoadedBool: boolean) => setIsLoaded(() => isLoadedBool), []);

    return { isLoaded, set };
}
export function useRetry(): HookRetry {
    const [retry, setRetry]: [boolean, Dispatch<SetStateAction<boolean>>] = useState((false as boolean));

    const set = useCallback(() => setRetry(() => !retry), [retry]);

    return { retry, set };
}
export function useItems(): HookStatsHomepage {
    const [items, setItems]: [string[], Dispatch<SetStateAction<string[]>>] = useState(([] as string[]));

    const set = useCallback((results: string[]) => setItems(() => results), []);

    return { items, set };
}
export function usePlayer(): HookPlayer {
    const [players, setItems]: [PlayerMapped[], Dispatch<SetStateAction<PlayerMapped[]>>] = useState(([] as PlayerMapped[]));

    const set = useCallback((players: PlayerMapped[]) => setItems(() => players), []);

    return { players, set };
}
export function useGames(): HookGames {
    const [games, setItems]: [GameMapped[], Dispatch<SetStateAction<GameMapped[]>>] = useState(([] as GameMapped[]));

    const set = useCallback((games: GameMapped[]) => setItems(() => games), []);

    return { games, set };
}
export function useStandings(): HookStandings {
    const [standings, setItems]: [StandingMapped[], Dispatch<SetStateAction<StandingMapped[]>>] = useState(([] as StandingMapped[]));

    const set = useCallback((games: StandingMapped[]) => setItems(() => games), []);

    return { standings, set };
}
export function useStatistic(): HookStatistic {
    const init = {
        awayStatistic: null as StatisticMapped | null,
        homeStatistic: null as StatisticMapped | null
    };
    const [statistics, setItems]: [HookStatisticData, Dispatch<SetStateAction<HookStatisticData>>] = useState((init as HookStatisticData));

    const set = useCallback((statistics: HookStatisticData) => setItems(() => statistics), []);

    return { statistics, set };
}
export function useSearch(): HookSearch {
    const [search, setSearch]: [string, Dispatch<SetStateAction<string>>] = useState('' as string);

    const set = useCallback((err: string) => setSearch(() => err), []);

    return { search, set };
}
