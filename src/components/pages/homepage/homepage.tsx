import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from "redux"
import { HookConference } from '../../../interfaces/hooks/hook-conference';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { Conference, Store } from '../../../interfaces/redux/store';
import { GetConferenceTeamList, Team } from '../../../interfaces/services/response/get-conference-team-list';
import { saveWestConference, saveEastConference } from '../../../redux/actions/conference';
import { useConference, useError, useLoaded, useRetry } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import './homepage.scss';

function Homepage(): JSX.Element {
    /**
     * Init hooks
     */
    const errorDetails: HookError = useError();
    const itemsWestConferenceDetails: HookConference = useConference();
    const itemsEastConferenceDetails: HookConference = useConference();
    const loadedDetails: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();

    /**
     * Selector redux
     */
    const { westConference, eastConference } = useSelector((state: Store) => state)


    /**
       * Setup effect hooks
       */
    useEffect(() => {
        if (westConference.length > 0 || eastConference.length > 0) {
            return;
        }
        Promise.all([
            interceptor("https://api-nba-v1.p.rapidapi.com/teams/confName/west"),
            interceptor("https://api-nba-v1.p.rapidapi.com/teams/confName/east")
        ]).then(([west, east]: GetConferenceTeamList[]) => {
            loadedDetails.set(true);

            const westList = mappingResponseConference(west);
            const eastList = mappingResponseConference(east);

            itemsWestConferenceDetails.set(westList);
            itemsEastConferenceDetails.set(eastList);
        }).catch((error) => {
            loadedDetails.set(true);
            errorDetails.set(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    const dispatch: Dispatch<any> = useDispatch()

    const isEastConferenceToSaved = itemsEastConferenceDetails.conference.length > 0 && eastConference.length === 0;
    const isWestConferenceToSaved = itemsWestConferenceDetails.conference.length > 0 && westConference.length === 0;

    if (isEastConferenceToSaved || isWestConferenceToSaved) {
        dispatch(saveWestConference(itemsWestConferenceDetails.conference))
        dispatch(saveEastConference(itemsEastConferenceDetails.conference))
    }

    return (
        <div className="conference--list">
            <div className="conference">
                <h2>East Conference</h2>
                {eastConference.map((team: Conference) => (
                    <p key={team.teamId}>
                        <Link to={`/team/${team.teamId}`}>
                            {team.name} ({team.shortName})
                        </Link>
                    </p>))}
            </div>
            <div className="conference">
                <h2>West Conference</h2>
                {westConference.map((team: Conference) => (
                    <p key={team.teamId}>
                        <Link to={`/team/${team.teamId}`}>
                            {team.name} ({team.shortName})
                        </Link>
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Homepage;

function mappingResponseConference(response: GetConferenceTeamList) {
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

