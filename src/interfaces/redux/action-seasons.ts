import { ActionRedux } from "../../enums/action-redux.enum";
import { Conference } from "./store";

export interface ActionSaveSeason {
    type: typeof ActionRedux.SAVE_SEASON,
    payload: string[]
}
export interface ActionSelectSeason {
    type: typeof ActionRedux.SELECT_SEASON,
    payload: string
}
export interface ActionSaveWestConference {
    type: typeof ActionRedux.SAVE_WEST_CONF,
    payload: Conference[]
}
export interface ActionSaveEastConference {
    type: typeof ActionRedux.SAVE_EAST_CONF,
    payload: Conference[]
}

export type SeasonsType = ActionSaveSeason | ActionSelectSeason | ActionSaveWestConference | ActionSaveEastConference;