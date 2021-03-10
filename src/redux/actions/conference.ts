import { ActionRedux } from "../../enums/action-redux.enum";
import { SeasonsType, ActionSaveWestConference, ActionSaveEastConference } from "../../interfaces/redux/action-seasons";
import { Conference } from "../../interfaces/redux/store";

export function saveWestConference(payload: Conference[]): SeasonsType {
    const action = {
        type: ActionRedux.SAVE_WEST_CONF,
        payload,
    };

    return action as ActionSaveWestConference;
}
export function saveEastConference(payload: Conference[]): SeasonsType {
    const action = {
        type: ActionRedux.SAVE_EAST_CONF,
        payload,
    };

    return action as ActionSaveEastConference;
}
