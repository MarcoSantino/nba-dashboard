import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookGames } from '../../../interfaces/hooks/hook-games';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookPlayer } from '../../../interfaces/hooks/hook-player';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { HookStandings } from '../../../interfaces/hooks/hook-standings';
import { Conference, Store } from '../../../interfaces/redux/store';
import { Game, GameMapped, GetGames } from '../../../interfaces/services/response/get-games';
import { GetPlayers, Player, PlayerMapped } from '../../../interfaces/services/response/get-players';
import { GetStandings, StandingMapped } from '../../../interfaces/services/response/get-standings';
import { useError, useGames, useLoaded, usePlayer, useRetry, useStandings } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
import { upperCaseFirst } from '../../../utils/labels';
import Loader from '../../shared/loader/loader';
import './team.scss';

function Team(): JSX.Element {
    /**
     * Get url params
     */
    const { id }: { id: string } = useParams();

    /**
     * Init hooks
     */
    const errorDetails: HookError = useError();
    const standingsListError: HookError = useError();
    const playersList: HookPlayer = usePlayer();
    const gamesList: HookGames = useGames();
    const standingsList: HookStandings = useStandings();
    const loadedDetails: HookLoaded = useLoaded();
    const standingsListLoader: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();
    const standingsListRetry: HookRetry = useRetry();

    /**
     * Selector redux
     */
    const { seasonSelected, westConference, eastConference } = useSelector((state: Store) => state)

    const teamSelected = westConference.find((team: Conference) => team.teamId === id) ||
        eastConference.find((team: Conference) => team.teamId === id);

    /**
       * Setup effect hooks
       */
    useEffect(() => {
        if (!Boolean(teamSelected) || gamesList.games.length > 0 || playersList.players.length > 0) {
            return;
        }

        Promise.all([
            interceptor(`https://api-nba-v1.p.rapidapi.com/games/teamId/${id}`),
            interceptor(`https://api-nba-v1.p.rapidapi.com/players/teamId/${id}`)
        ]).then(([games, players]: [GetGames, GetPlayers]) => {
            loadedDetails.set(true);

            const gamesMapped = games.api.games.reduce((games: GameMapped[], game: Game) => {
                if (game.seasonStage !== '2') {
                    return games;
                }

                return [
                    ...games,
                    {
                        arena: game.arena,
                        city: game.city,
                        points: `${game.vTeam?.score?.points} - ${game.hTeam?.score?.points}`,
                        game: `${game.vTeam?.shortName} - ${game.hTeam?.shortName}`,
                        year: game.seasonYear,
                        gameId: game.gameId,
                        home: {
                            isCurrent: id === game.hTeam.teamId,
                            isWinner: Number(game.hTeam?.score?.points) > Number(game.vTeam?.score?.points),
                            logo: game.hTeam?.logo,
                            name: game.hTeam?.fullName
                        },
                        away: {
                            isCurrent: id === game.vTeam.teamId,
                            isWinner: Number(game.hTeam?.score?.points) < Number(game.vTeam?.score?.points),
                            logo: game.vTeam?.logo,
                            name: game.vTeam?.fullName
                        }
                    }
                ]
            }, []);
            const playersMapped = players.api.players.map((player: Player) => {
                const dateOfBirth = new Date(player.dateOfBirth);

                const birthDate = `${dateOfBirth.getDate()}/${dateOfBirth.getMonth() + 1}/${dateOfBirth.getFullYear()}`;
                return {
                    fullName: `${player.firstName} ${player.lastName}`,
                    birthDate,
                    isActive: player.leagues?.standard?.active === "1",
                    jersey: player.leagues?.standard?.jersey,
                    position: player.leagues?.standard?.pos
                };
            });

            gamesList.set(gamesMapped);
            playersList.set(playersMapped);

        }).catch(() => {
            loadedDetails.set(true);
            errorDetails.set('Ops... there is an error.');
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    useEffect(() => {
        if (!Boolean(teamSelected) || standingsList.standings.some(standing => standing.year === seasonSelected)) {
            return;
        }
        interceptor(`https://api-nba-v1.p.rapidapi.com/standings/standard/${seasonSelected}/teamId/${id}`)
            .then((standings: GetStandings) => {
                standingsListLoader.set(true);

                const standingsMapped = standings.api.standings.map(standing => ({
                    year: standing.seasonYear,
                    away: standing.away,
                    home: standing.home,
                    conferenceRank: standing.conference.rank,
                    conferenceName: standing.conference.name,
                    divisionRank: standing.division.rank,
                    divisionName: standing.division.name,
                    totalWin: standing.win,
                    totalLoss: standing.loss,
                }));

                standingsList.set(standingsMapped);
            })
            .catch(() => {
                standingsListLoader.set(true);
                standingsListError.set('Ops... there is an error.');
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, seasonSelected, standingsListRetry.retry]);

    if (!Boolean(teamSelected)) {
        return (<Redirect to="/" />);
    }

    if (!loadedDetails.isLoaded) {
        return (<div className="team text-center">
            <Loader />
        </div>)
    }
    if (loadedDetails.isLoaded && errorDetails.error) {
        return (<div className="team">{errorDetails.error}</div>)
    }

    let gamesEl: HTMLDivElement | null;
    let playersEl: HTMLDivElement | null;
    let teamEl: HTMLDivElement | null;

    function scroll(el: HTMLDivElement | null) {
        el?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="team" ref={team => { teamEl = team; }}>
            <div className="team--head">
                <img src={teamSelected?.logo} alt={teamSelected?.logo} />
                <h2>{teamSelected?.name}</h2>

                <ul>
                    <li onClick={() => scroll(gamesEl)}>Games</li>
                    <li onClick={() => scroll(playersEl)}>Players</li>
                </ul>
            </div>
            <div className="team--statistic--wrapper">
                <div className="team--statistic--head">
                    <h3>Statistics</h3>
                </div>
                {standingsList.standings.length > 0 ? standingsList.standings.map((standing: StandingMapped, index: number) => {
                    return (
                        <div className="team--statistic" key={index}>
                            <div className="team--statistic__year"><b>Year:</b> {standing.year}</div>
                            <div className="team--statistic__games">
                                <b>Win: {standing.totalWin}</b>
                                <p>Home | {standing.home?.win}</p>
                                <p>Away | {standing.away?.win}</p>
                            </div>
                            <div className="team--statistic__games">
                                <b>Loss: {standing.totalLoss}</b>
                                <p>Home | {standing.home?.loss}</p>
                                <p>Away | {standing.away?.loss}</p>
                            </div>
                            <div className="team--statistic__ranking">
                                <b>Conference:</b>
                                <p>{upperCaseFirst(standing.conferenceName)} - {standing.conferenceRank}</p>
                            </div>
                            <div className="team--statistic__ranking">
                                <b>Division:</b>
                                <p>{upperCaseFirst(standing.divisionName)} - {standing.divisionRank}</p>
                            </div>
                        </div>
                    );
                }) : <div>Statistics not found</div>}
            </div>
            <div className="team--games" ref={games => { gamesEl = games; }}>
                <div className="team--players--head">
                    <h3>Games</h3>
                    <p onClick={() => scroll(teamEl)}>Back to top</p>
                </div>
                <div className="team--games--list">
                    {gamesList.games.reduce((items: JSX.Element[], game: GameMapped, index: number) => {
                        if (game.year !== seasonSelected) {
                            return items;
                        }

                        const isHomeAndWinner = game.home?.isCurrent && game.home?.isWinner;
                        const isAwayAndWinner = game.away?.isCurrent && game.away?.isWinner;
                        const isPointsFounded = game.points !== ' - ';
                        return [
                            ...items,
                            <div key={index} className="team--games--item">
                                {isPointsFounded && <span className={`team--games--item__${isHomeAndWinner || isAwayAndWinner ? 'winner' : 'loser'}`}>
                                    {isHomeAndWinner || isAwayAndWinner ? 'W' : 'L'}
                                </span>}
                                <div className="team--games--item__head">
                                    <div className="team--games--item__img">
                                        <img src={game.away?.logo || 'https://via.placeholder.com/50'} alt={game.away?.name} />
                                        <span>-</span>
                                        <img src={game.home?.logo || 'https://via.placeholder.com/50'} alt={game.home?.name} />
                                    </div>
                                    {
                                        Boolean(game.arena) &&
                                        <p className="team--games--item__location">
                                            {game.arena} ({game.city})
                                        </p>
                                    }
                                    <p className="team--games--item__game">{game.game}</p>
                                    <p className="team--games--item__points">{game.points}</p>
                                </div>

                                {game.gameId && (
                                    <Link className="team--games--item__view-details" to={`/game/${game.gameId}`}>View Details</Link>
                                )}
                            </div>
                        ]
                    }, [])}
                </div>
            </div>
            <div className="team--players" ref={players => { playersEl = players; }}>
                <div className="team--players--head">
                    <h3>Players</h3>
                    <p onClick={() => scroll(teamEl)}>Back to top</p>
                </div>
                <div className="team--players--list">
                    {playersList.players.map((player: PlayerMapped, index: number) => (
                        <div key={index} className="team--players--item">
                            <div className="team--players--item__jersey">
                                {player.jersey && <span>{player.jersey}</span>}
                            </div>
                            <span>{player.fullName}</span>
                            <span>{player.position}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Team;
