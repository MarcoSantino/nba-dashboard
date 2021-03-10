import { ActionRedux } from "../../enums/action-redux.enum"
import { ActionSaveSeason, ActionSelectSeason, SeasonsType } from "../../interfaces/redux/action-seasons"

export function addSeasons(payload: string[]): SeasonsType {
    const action = {
        type: ActionRedux.SAVE_SEASON,
        payload,
    };

    return action as ActionSaveSeason;
}
export function selectSeasons(payload: string): SeasonsType {
    const action = {
        type: ActionRedux.SELECT_SEASON,
        payload,
    };

    return action as ActionSelectSeason;
}
