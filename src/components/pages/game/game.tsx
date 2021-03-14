import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookStatistic } from '../../../interfaces/hooks/hook-statistic';
import { Conference, Store } from '../../../interfaces/redux/store';
import { GetGameDetail, Statistic, StatisticMapped } from '../../../interfaces/services/response/get-game-detail';
import { useError, useLoaded, useRetry, useStatistic } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import Loader from '../../shared/loader/loader';
import './game.scss';

function Game(): JSX.Element {
    /**
     * Get url params
     */
    const { id }: { id: string } = useParams();

    /**
     * Selector redux
     */
    const { westConference, eastConference } = useSelector((state: Store) => state)

    /**
     * Init hooks
     */
    const errorDetails: HookError = useError();
    const loadedDetails: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();
    const statisticDetails: HookStatistic = useStatistic();

    useEffect(() => {
        if (statisticDetails.statistics?.awayStatistic || statisticDetails.statistics?.homeStatistic
            || westConference.length === 0 || eastConference.length === 0) {
            return;
        }
        interceptor(`https://api-nba-v1.p.rapidapi.com/statistics/games/gameId/${id}`)
            .then((game: GetGameDetail) => {
                loadedDetails.set(true);
                const [away, home] = game.api.statistics;

                const awayTeam = westConference.find((team: Conference) => team.teamId === away.teamId) ||
                    eastConference.find((team: Conference) => team.teamId === away.teamId)
                const homeTeam = westConference.find((team: Conference) => team.teamId === home.teamId) ||
                    eastConference.find((team: Conference) => team.teamId === home.teamId)

                const awayStatistic = statisticMapper(away, awayTeam);
                const homeStatistic = statisticMapper(home, homeTeam);

                statisticDetails.set({
                    awayStatistic,
                    homeStatistic
                });
            }).catch(() => {
                loadedDetails.set(true);
                errorDetails.set('Ops... there is an error');
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    if (westConference.length === 0 || eastConference.length === 0) {
        return (<Redirect to="/" />);
    }

    if (!loadedDetails.isLoaded) {
        return (<div className="game text-center">
            <Loader />
        </div>)
    }
    if (loadedDetails.isLoaded && errorDetails.error) {
        return (<div className="game">{errorDetails.error}</div>)
    }

    return (
        <div className="game">
            <div className="game--head">
                <div>
                    <img src={statisticDetails.statistics?.awayStatistic?.logo || 'https://via.placeholder.com/150'}
                        alt={statisticDetails.statistics?.awayStatistic?.name || 'Name not found'} />
                </div>
                <span>-</span>
                <div>
                    <img src={statisticDetails.statistics?.homeStatistic?.logo || 'https://via.placeholder.com/150'}
                        alt={statisticDetails.statistics?.homeStatistic?.name || 'Name not found'} />
                </div>
            </div>

            <div className="game--item">
                {statisticDetails.statistics?.awayStatistic?.name ? <div>
                    <Link to={`/team/${statisticDetails.statistics?.awayStatistic?.teamId}`}>
                        {statisticDetails.statistics?.awayStatistic?.name}
                    </Link>
                </div> : <div>Name not found</div>}
                <div></div>
                {statisticDetails.statistics?.homeStatistic?.name ? <div>
                    <Link to={`/team/${statisticDetails.statistics?.homeStatistic?.teamId}`}>
                        {statisticDetails.statistics?.homeStatistic?.name}
                    </Link>
                </div> : <div>Name not found</div>}
            </div>
            <div className="game--item">
                <div>{statisticDetails.statistics?.awayStatistic?.points}</div>
                <div>Points</div>
                <div>{statisticDetails.statistics?.homeStatistic?.points}</div>
            </div>
            <div className="game--item">
                <div>{statisticDetails.statistics?.awayStatistic?.assists}</div>
                <div>Assists</div>
                <div>{statisticDetails.statistics?.homeStatistic?.assists}</div>
            </div>
            <div className="game--item">
                <div>{statisticDetails.statistics?.awayStatistic?.rebounds}</div>
                <div>Rebounds</div>
                <div>{statisticDetails.statistics?.homeStatistic?.rebounds}</div>
            </div>
            <div className="game--item">
                <div>{statisticDetails.statistics?.awayStatistic?.blocks}</div>
                <div>Blocks</div>
                <div>{statisticDetails.statistics?.homeStatistic?.blocks}</div>
            </div>
            <div className="game--item">
                <div>{statisticDetails.statistics?.awayStatistic?.steals}</div>
                <div>Steals</div>
                <div>{statisticDetails.statistics?.homeStatistic?.steals}</div>
            </div>
        </div>
    );
}

export default Game;

function statisticMapper(statistic: Statistic, team: Conference | undefined): StatisticMapped {
    return {
        points: statistic.points,
        steals: statistic.steals,
        assists: statistic.assists,
        blocks: statistic.blocks,
        rebounds: statistic.totReb,
        logo: team?.logo,
        name: team?.name,
        teamId: team?.teamId
    }
}