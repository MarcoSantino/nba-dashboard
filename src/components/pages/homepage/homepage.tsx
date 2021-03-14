import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from "redux"
import { HookConference } from '../../../interfaces/hooks/hook-conference';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookSearch } from '../../../interfaces/hooks/hook-search';
import { Conference, Store } from '../../../interfaces/redux/store';
import { GetConferenceTeamList } from '../../../interfaces/services/response/get-conference-team-list';
import { saveWestConference, saveEastConference } from '../../../redux/actions/conference';
import { useConference, useError, useLoaded, useRetry, useSearch } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import { mappingResponseConference } from '../../../utils/mapper/conference-mapper';
import Input from '../../form/input/input';
import Loader from '../../shared/loader/loader';
import './homepage.scss';

function Homepage(): JSX.Element {
    /**
     * Init hooks
     */
    const error: HookError = useError();
    const itemsWestConferenceDetails: HookConference = useConference();
    const itemsEastConferenceDetails: HookConference = useConference();
    const loader: HookLoaded = useLoaded();
    const retry: HookRetry = useRetry();
    const search: HookSearch = useSearch();

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
            loader.set(true);

            const westList = mappingResponseConference(west);
            const eastList = mappingResponseConference(east);

            itemsWestConferenceDetails.set(westList);
            itemsEastConferenceDetails.set(eastList);
        }).catch(() => {
            loader.set(true);
            error.set('Ops... there is an error');
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retry.retry])

    const dispatch: Dispatch<any> = useDispatch()

    const isEastConferenceToSave = itemsEastConferenceDetails.conference.length > 0 && eastConference.length === 0;
    const isWestConferenceToSave = itemsWestConferenceDetails.conference.length > 0 && westConference.length === 0;

    if (isEastConferenceToSave || isWestConferenceToSave) {
        dispatch(saveWestConference(itemsWestConferenceDetails.conference))
        dispatch(saveEastConference(itemsEastConferenceDetails.conference))
    }

    function onChangeSearch(event: ChangeEvent<HTMLInputElement>): void {
        const { value } = event.target;
        search.set(value);
    }

    if (!loader.isLoaded && westConference.length === 0 && eastConference.length === 0) {
        return (<div className="conference--wrapper text-center">
            <Loader />
        </div>)
    }
    if (loader.isLoaded && error.error) {
        return (<div className="conference--wrapper">{error.error}</div>)
    }

    return (
        <div className="conference--wrapper">
            <Input id="search" label="Search" placeholder="Search your team..." onChange={onChangeSearch}
                value={search.search} />
            <div className="conference--list">
                <div className="conference">
                    <h2>East Conference</h2>
                    {eastConference.reduce((teams: JSX.Element[], team: Conference) => {
                        if (Boolean(search.search) && team.name.toLowerCase().indexOf(search.search.toLowerCase()) < 0) {
                            return teams;
                        }

                        return [
                            ...teams,
                            <p key={team.teamId}>
                                <Link to={`/team/${team.teamId}`}>
                                    {team.name} ({team.shortName})
                                </Link>
                            </p>
                        ]
                    }, [])}
                </div>
                <div className="conference">
                    <h2>West Conference</h2>
                    {westConference.reduce((teams: JSX.Element[], team: Conference) => {
                        if (Boolean(search.search) && team.name.toLowerCase().indexOf(search.search.toLowerCase()) < 0) {
                            return teams;
                        }

                        return [
                            ...teams,
                            <p key={team.teamId}>
                                <Link to={`/team/${team.teamId}`}>
                                    {team.name} ({team.shortName})
                                </Link>
                            </p>
                        ]
                    }, [])}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
