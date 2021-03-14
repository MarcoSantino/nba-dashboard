import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { ActionCreator, bindActionCreators } from 'redux';
import { SidebarComponent } from '../../../interfaces/components/sidebar-component';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { SeasonsType } from '../../../interfaces/redux/action-seasons';
import { Store } from '../../../interfaces/redux/store';
import { GetSeasons } from '../../../interfaces/services/response/get-seasons';
import { addSeasons, selectSeasons } from '../../../redux/actions/season';
import { useError, useLoaded, useRetry } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import Loader from '../loader/loader';
import './sidebar.scss';

function Sidebar({ seasonSelected, seasons, addSeasonsFunction, selectSeasonsFunction }: SidebarComponent): JSX.Element {
    /**
     * Init hooks
     */
    const error: HookError = useError();
    const loader: HookLoaded = useLoaded();
    const retry: HookRetry = useRetry();

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

                const seasonList = result.api.seasons.sort(
                    (a: string, b: string) => Number(a) > Number(b) ? -1 : Number(a) < Number(b) ? 1 : 0
                );

                addSeasonsFunction(seasonList)
                selectSeasonsFunction(seasonList[0])
            })
            .catch((error) => {
                loader.set(true);
                error.set(error);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retry.retry])

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
                <p onClick={() => selectSeasonsFunction(season)}
                    className={`sidebar--item ${seasonSelected === season ? 'selected' : ''}`} key={season}>
                    {season}
                </p>
            )}
        </div>
    );
}

const mapStateToProps = (state: Store) => ({
    seasonSelected: state.seasonSelected,
    seasons: state.seasons
})

function mapDispatchToProps(dispatch: Dispatch<SeasonsType>) {
    return bindActionCreators({
        addSeasonsFunction: (props: string[]) => dispatch(addSeasons(props)),
        selectSeasonsFunction: (props: string) => dispatch(selectSeasons(props))
    }, dispatch as ActionCreator<any>)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);
