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
import './sidebar.scss';

function Sidebar(): JSX.Element {
    /**
     * Init hooks
     */
    const errorDetails: HookError = useError();
    const itemsDetails: HookStatsHomepage = useItems();
    const loadedDetails: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();

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
                loadedDetails.set(true);

                itemsDetails.set(result.api.seasons.sort(
                    (a: string, b: string) => Number(a) > Number(b) ? -1 : Number(a) < Number(b) ? 1 : 0
                ));
            })
            .catch((error) => {
                loadedDetails.set(true);
                errorDetails.set(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    const dispatch: Dispatch<any> = useDispatch()

    if (itemsDetails.items.length > 0 && seasons.length === 0) {
        dispatch(addSeasons(itemsDetails.items))
        dispatch(selectSeasons(itemsDetails.items[0]))
    }

    if (!loadedDetails.isLoaded) {
        return (<div className="team">Loading...</div>)
    }
    if (loadedDetails.isLoaded && errorDetails.error) {
        return (<div className="team">{errorDetails.error}</div>)
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
