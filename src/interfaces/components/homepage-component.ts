import { Conference } from "../redux/store";

export interface HomepageComponent {
    westConference: Conference[];
    eastConference: Conference[];
    saveWestConferenceFunction: (props: Conference[]) => void;
    saveEastConferenceFunction: (props: Conference[]) => void;
}
