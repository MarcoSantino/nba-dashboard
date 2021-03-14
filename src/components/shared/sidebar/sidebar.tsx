import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookStatsHomepage } from '../../../interfaces/hooks/hook-stats-homepage';
import { Store } from '../../../interfaces/redux/store';
import { GetSeasons } from '../../../interfaces/services/response/get-seasons';
import { addSeasons, selectSeasons } from '../../../redux/actions/season';
import { useError, useItems, useLoaded, useRetry } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import Loader from '../loader/loader';
import './sidebar.scss';

function Sidebar(): JSX.Element {
    /**
     * Init hooks
     */
    const error: HookError = useError();
    const seasonList: HookStatsHomepage = useItems();
    const loader: HookLoaded = useLoaded();
    const retry: HookRetry = useRetry();

    /**
     * Selector redux
     */
    const { seasons, seasonSelected } = useSelector((state: Store) => state)

    /**
       * Setup effect hooks
       */
    useEffect(() => {
        if (seasons.length > 0) {
            return;
        }
        interceptor("https://api-nba-v1.p.rapidapi.com/seasons/")
            .then((result: GetSeasons) => {
                loader.set(true);

                seasonList.set(result.api.seasons.sort(
                    (a: string, b: string) => Number(a) > Number(b) ? -1 : Number(a) < Number(b) ? 1 : 0
                ));
            })
            .catch((error) => {
                loader.set(true);
                error.set(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retry.retry])

    const dispatch: Dispatch<any> = useDispatch()

    if (seasonList.items.length > 0 && seasons.length === 0) {
        dispatch(addSeasons(seasonList.items))
        dispatch(selectSeasons(seasonList.items[0]))
    }

    if (!loader.isLoaded) {
        return (<div className="sidebar text-center">
            <Loader />
        </div>)
    }
    if (loader.isLoaded && error.error) {
        return (<div className="sidebar">{error.error}</div>)
    }

    return (
        <div className="sidebar">
            {seasons.map((season: string) =>
                <p onClick={() => dispatch(selectSeasons(season))}
                    className={`sidebar--item ${seasonSelected === season ? 'selected' : ''}`} key={season}>
                    {season}
                </p>
            )}
        </div>
    );
}

export default Sidebar;
