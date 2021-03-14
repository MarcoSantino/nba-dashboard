import React, { ChangeEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from "redux"
import { HomepageComponent } from '../../../interfaces/components/homepage-component';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookSearch } from '../../../interfaces/hooks/hook-search';
import { Conference, Store } from '../../../interfaces/redux/store';
import { GetConferenceTeamList } from '../../../interfaces/services/response/get-conference-team-list';
import { saveWestConference, saveEastConference } from '../../../redux/actions/conference';
import { useError, useLoaded, useRetry, useSearch } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import { mappingResponseConference } from '../../../utils/mapper/conference-mapper';
import Input from '../../form/input/input';
import Loader from '../../shared/loader/loader';
import './homepage.scss';

function Homepage({
    westConference,
    eastConference,
    saveWestConferenceFunction,
    saveEastConferenceFunction
}: HomepageComponent): JSX.Element {
    /**
     * Init hooks
     */
    const error: HookError = useError();
    const loader: HookLoaded = useLoaded();
    const retry: HookRetry = useRetry();
    const search: HookSearch = useSearch();

    /**
       * Setup effect hooks
       */
    useEffect(() => {
        if ((westConference && westConference.length > 0) || (eastConference && eastConference.length > 0)) {
            return;
        }
        Promise.all([
            interceptor("https://api-nba-v1.p.rapidapi.com/teams/confName/west"),
            interceptor("https://api-nba-v1.p.rapidapi.com/teams/confName/east")
        ]).then(([west, east]: GetConferenceTeamList[]) => {
            loader.set(true);

            const westList = mappingResponseConference(west);
            const eastList = mappingResponseConference(east);

            saveWestConferenceFunction(westList)
            saveEastConferenceFunction(eastList)
        }).catch(() => {
            loader.set(true);
            error.set('Ops... there is an error');
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retry.retry])

    function onChangeSearch(event: ChangeEvent<HTMLInputElement>): void {
        const { value } = event.target;
        search.set(value);
    }

    if (!loader.isLoaded && westConference?.length === 0 && eastConference?.length === 0) {
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
                    {eastConference?.reduce((teams: JSX.Element[], team: Conference) => {
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
                    {westConference?.reduce((teams: JSX.Element[], team: Conference) => {
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

const mapStateToProps = (state: Store) => ({
    eastConference: state.eastConference,
    westConference: state.westConference
})

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        saveWestConferenceFunction: (props: Conference[]) => dispatch(saveWestConference(props)),
        saveEastConferenceFunction: (props: Conference[]) => dispatch(saveEastConference(props))
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Homepage);
