import { Conference } from "../redux/store";

export interface HookConference {
    conference: Conference[];
    set: (conference: Conference[]) => void;
}
