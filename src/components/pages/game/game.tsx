import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookStatistic } from '../../../interfaces/hooks/hook-statistic';
import { Conference, Store } from '../../../interfaces/redux/store';
import { GetGameDetail } from '../../../interfaces/services/response/get-game-detail';
import { useError, useLoaded, useRetry, useStatistic } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import { statisticMapper } from '../../../utils/mapper/game-mapper';
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
    const error: HookError = useError();
    const loader: HookLoaded = useLoaded();
    const lockRetry: HookRetry = useRetry();
    const statisticsHook: HookStatistic = useStatistic();

    useEffect(() => {
        if (statisticsHook.statistics?.awayStatistic || statisticsHook.statistics?.homeStatistic
            || westConference.length === 0 || eastConference.length === 0) {
            return;
        }
        interceptor(`https://api-nba-v1.p.rapidapi.com/statistics/games/gameId/${id}`)
            .then((game: GetGameDetail) => {
                loader.set(true);
                const [away, home] = game.api.statistics;

                const awayTeam = westConference.find((team: Conference) => team.teamId === away.teamId) ||
                    eastConference.find((team: Conference) => team.teamId === away.teamId)
                const homeTeam = westConference.find((team: Conference) => team.teamId === home.teamId) ||
                    eastConference.find((team: Conference) => team.teamId === home.teamId)

                const awayStatistic = statisticMapper(away, awayTeam);
                const homeStatistic = statisticMapper(home, homeTeam);

                statisticsHook.set({
                    awayStatistic,
                    homeStatistic
                });
            }).catch(() => {
                loader.set(true);
                error.set('Ops... there is an error');
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockRetry.retry])

    if (westConference.length === 0 || eastConference.length === 0) {
        return (<Redirect to="/" />);
    }

    if (!loader.isLoaded) {
        return (<div className="game text-center">
            <Loader />
        </div>)
    }
    if (loader.isLoaded && error.error) {
        return (<div className="game">{error.error}</div>)
    }

    const { awayStatistic, homeStatistic } = statisticsHook.statistics;

    return (
        <div className="game">
            <div className="game--head">
                <div>
                    <img src={awayStatistic?.logo || 'https://via.placeholder.com/150'}
                        alt={awayStatistic?.name || 'Name not found'} />
                </div>
                <span>-</span>
                <div>
                    <img src={homeStatistic?.logo || 'https://via.placeholder.com/150'}
                        alt={homeStatistic?.name || 'Name not found'} />
                </div>
            </div>

            <div className="game--item">
                {awayStatistic?.name ? <div>
                    <Link to={`/team/${awayStatistic?.teamId}`}>
                        {awayStatistic?.name}
                    </Link>
                </div> : <div>Name not found</div>}
                <div></div>
                {homeStatistic?.name ? <div>
                    <Link to={`/team/${homeStatistic?.teamId}`}>
                        {homeStatistic?.name}
                    </Link>
                </div> : <div>Name not found</div>}
            </div>
            <div className="game--item">
                <div>{awayStatistic?.points}</div>
                <div>Points</div>
                <div>{homeStatistic?.points}</div>
            </div>
            <div className="game--item">
                <div>{awayStatistic?.assists}</div>
                <div>Assists</div>
                <div>{homeStatistic?.assists}</div>
            </div>
            <div className="game--item">
                <div>{awayStatistic?.rebounds}</div>
                <div>Rebounds</div>
                <div>{homeStatistic?.rebounds}</div>
            </div>
            <div className="game--item">
                <div>{awayStatistic?.blocks}</div>
                <div>Blocks</div>
                <div>{homeStatistic?.blocks}</div>
            </div>
            <div className="game--item">
                <div>{awayStatistic?.steals}</div>
                <div>Steals</div>
                <div>{homeStatistic?.steals}</div>
            </div>
        </div>
    );
}

export default Game;
