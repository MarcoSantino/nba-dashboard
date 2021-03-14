import { Game, GameMapped } from "../../interfaces/services/response/get-games";
import { Player, PlayerMapped } from "../../interfaces/services/response/get-players";
import { Standing, StandingMapped } from "../../interfaces/services/response/get-standings";

export function gameMapper(game: Game, id: string): GameMapped {
    return {
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
    };
}

export function playerMapper(player: Player): PlayerMapped {
    const dateOfBirth = new Date(player.dateOfBirth);

    const birthDate = `${dateOfBirth.getDate()}/${dateOfBirth.getMonth() + 1}/${dateOfBirth.getFullYear()}`;

    return {
        fullName: `${player.firstName} ${player.lastName}`,
        birthDate,
        isActive: player.leagues?.standard?.active === "1",
        jersey: player.leagues?.standard?.jersey,
        position: player.leagues?.standard?.pos
    };
}

export function statisticTeam(standing: Standing): StandingMapped {
    return {
        year: standing.seasonYear,
        away: standing.away,
        home: standing.home,
        conferenceRank: standing.conference.rank,
        conferenceName: standing.conference.name,
        divisionRank: standing.division.rank,
        divisionName: standing.division.name,
        totalWin: standing.win,
        totalLoss: standing.loss,
    };
}
