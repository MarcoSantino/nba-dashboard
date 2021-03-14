import { Conference } from "../redux/store";

export interface HomepageComponent {
    westConference: Conference[];
    eastConference: Conference[];
    saveWestConferenceFunction: (props: Conference[]) => any;
    saveEastConferenceFunction: (props: Conference[]) => any;
}
