import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { useError, useLoaded, useRetry } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import './game.scss';

function Game(): JSX.Element {
    /**
     * Get url params
     */
    const { id }: { id: string } = useParams();

    /**
     * Init hooks
     */
    const errorDetails: HookError = useError();
    const loadedDetails: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();


    useEffect(() => {
        interceptor(`https://api-nba-v1.p.rapidapi.com/statistics/games/gameId/${id}`)
            .then((game) => {
            }).catch((error) => {
                loadedDetails.set(true);
                errorDetails.set(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    return (
        <div>Game {id}</div>
    );
}

export default Game;
