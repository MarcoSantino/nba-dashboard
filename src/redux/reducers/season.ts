import { ActionRedux } from "../../enums/action-redux.enum";
import { SeasonsType } from "../../interfaces/redux/action-seasons";
import { Store } from "../../interfaces/redux/store";

const initialState: Store = {
    eastConference: [],
    seasons: [],
    seasonSelected: '',
    westConference: []
};


const reducer = (
    state: Store = initialState,
    action: SeasonsType
): Store => {
    switch (action.type) {
        case ActionRedux.SAVE_SEASON:
            return {
                ...state,
                seasons: action.payload
            };
        case ActionRedux.SELECT_SEASON:
            return {
                ...state,
                seasonSelected: action.payload
            };
        case ActionRedux.SAVE_WEST_CONF:
            return {
                ...state,
                westConference: action.payload
            };
        case ActionRedux.SAVE_EAST_CONF:
            return {
                ...state,
                eastConference: action.payload
            };
        default:
            return state
    }
}

export default reducer