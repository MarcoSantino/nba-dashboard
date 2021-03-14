import { Conference } from "../../interfaces/redux/store";
import { GetConferenceTeamList, Team } from "../../interfaces/services/response/get-conference-team-list";

export function mappingResponseConference(response: GetConferenceTeamList) {
    return response.api.teams.reduce((conferenceList: Conference[], team: Team) => {
        if (team.allStar === '1') {
            return conferenceList;
        }

        return [
            ...conferenceList,
            {
                ...team.leagues.standard,
                name: team.fullName,
                nickname: team.nickname,
                logo: team.logo,
                teamId: team.teamId,
                shortName: team.shortName
            }
        ];
    }, []);
}

