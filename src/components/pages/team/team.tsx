import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { HookError } from '../../../interfaces/hooks/hook-error';
import { HookGames } from '../../../interfaces/hooks/hook-games';
import { HookLoaded } from '../../../interfaces/hooks/hook-loaded';
import { HookPlayer } from '../../../interfaces/hooks/hook-player';
import { HookRetry } from '../../../interfaces/hooks/hook-retry';
import { Conference, Store } from '../../../interfaces/redux/store';
import { Game, GameMapped, GetGames } from '../../../interfaces/services/response/get-games';
import { GetPlayers, Player, PlayerMapped } from '../../../interfaces/services/response/get-players';
import { useError, useGames, useLoaded, usePlayer, useRetry } from '../../../utils/hooks';
import { interceptor } from '../../../utils/interceptor';
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
    const playersList: HookPlayer = usePlayer();
    const gamesList: HookGames = useGames();
    const loadedDetails: HookLoaded = useLoaded();
    const retryDetails: HookRetry = useRetry();

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
                if (game.league !== 'standard') {
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
                            isWinner: game.hTeam?.score?.points > game.vTeam?.score?.points,
                            logo: game.hTeam?.logo,
                            name: game.hTeam?.fullName
                        },
                        away: {
                            isCurrent: id === game.vTeam.teamId,
                            isWinner: game.hTeam?.score?.points < game.vTeam?.score?.points,
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

        }).catch((error) => {
            loadedDetails.set(true);
            errorDetails.set(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryDetails.retry])

    if (!Boolean(teamSelected)) {
        return (<Redirect to="/" />);
    }

    return (
        <div className="team">
            <div className="team--head">
                <img src={teamSelected?.logo} alt={teamSelected?.logo} />
                <h2>{teamSelected?.name}</h2>
            </div>
            <div>
                <h3>Games</h3>
                <div>
                    {gamesList.games.reduce((items: JSX.Element[], game: GameMapped, index: number) => {
                        if (game.year !== seasonSelected) {
                            return items;
                        }

                        const isHomeAndWinner = game.home?.isCurrent && game.home?.isWinner;
                        const isAwayAndWinner = game.away?.isCurrent && game.away?.isWinner;
                        return [
                            ...items,
                            <div key={index}>
                                <span>{isHomeAndWinner || isAwayAndWinner ? 'W' : 'L'}</span>
                                <b>{game.game}</b>
                                <b>{game.points}</b>

                                {game.gameId && (<Link to={`/game/${game.gameId}`}>View Details</Link>)}
                            </div>
                        ]
                    }, [])}
                </div>
            </div>
            <div>
                <h3>Players</h3>
                <div>
                    {playersList.players.map((player: PlayerMapped) => (
                        <div>
                            {player.fullName}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Team;
