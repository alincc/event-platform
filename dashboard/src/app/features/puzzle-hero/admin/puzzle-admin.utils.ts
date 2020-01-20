import { TrackFormDto } from "./components/track-form/dto/track-form.dto";
import { CreateTrackDto, UpdateTrackDto, CreatePuzzleDto } from "../../../api/dto/puzzle-hero";
import { PuzzleHero, Track } from "../../../api/models/puzzle-hero";
import { PuzzleHeroSettingsDto } from "./components/puzzle-hero-settings/dto/puzzle-hero-settings.dto";
import { UpdateQuestionDto } from "src/app/api/dto/question";
import { InputTypes, QuestionTypes, ValidationTypes } from "../../../api/models/question";
import { QuestionFormDto } from "../../../components/question-form/dto/question-form.dto";

export namespace PuzzleAdminUtils {
    export function trackFormDtoToTrackDto(trackFormDto: TrackFormDto): CreateTrackDto | UpdateTrackDto {
        const releaseDate = trackFormDto.releaseDate;
        releaseDate.setHours(trackFormDto.releaseTime.getHours(), trackFormDto.releaseTime.getMinutes(), 0);
        const endDate = trackFormDto.endDate;
        endDate.setHours(trackFormDto.endTime.getHours(), trackFormDto.endTime.getMinutes(), 0);

        return {
            label: trackFormDto.label,
            type: trackFormDto.type,
            endDate,
            releaseDate
        };
    }

    export function trackToTrackFormDto(track: Track): TrackFormDto {
        return {
            ...track,
            releaseDate: new Date(track.releaseDate),
            releaseTime: new Date(track.releaseDate),
            endDate: new Date(track.endDate),
            endTime: new Date(track.endDate)
        };
    }

    export function puzzleFormDtoToPuzzleDto(parentId: string, questionFormDto: QuestionFormDto): CreatePuzzleDto {
        return {
            ...questionFormDto,
            type: questionFormDto.type as QuestionTypes,
            validationType: questionFormDto.validationType as ValidationTypes,
            inputType: questionFormDto.inputType as InputTypes,
            dependsOn: parentId
        };
    }

    export function puzzleFormDtoToUpdateQuestionDto(questionFormDto: QuestionFormDto): UpdateQuestionDto {
        return {
            ...questionFormDto,
            type: questionFormDto.type as QuestionTypes,
            validationType: questionFormDto.validationType as ValidationTypes,
            inputType: questionFormDto.inputType as InputTypes
        };
    }

    export function puzzleHeroToPuzzleHeroSettingsDto(puzzleHero: PuzzleHero): PuzzleHeroSettingsDto {
        return {
            ...puzzleHero,
            releaseDate: new Date(puzzleHero.releaseDate),
            releaseTime: new Date(puzzleHero.releaseDate),
            endDate: new Date(puzzleHero.endDate),
            endTime: new Date(puzzleHero.endDate),
            scoreboardEndDate: new Date(puzzleHero.scoreboardEndDate),
            scoreboardEndTime: new Date(puzzleHero.scoreboardEndDate)
        };
    }

    export function puzzleHeroSettingsDtoToPuzzleHero(puzzleHeroSettingsDto: PuzzleHeroSettingsDto): PuzzleHero {
        const releaseDate = puzzleHeroSettingsDto.releaseDate;
        releaseDate.setHours(puzzleHeroSettingsDto.releaseTime.getHours(), puzzleHeroSettingsDto.releaseTime.getMinutes(), 0);
        const endDate = puzzleHeroSettingsDto.endDate;
        endDate.setHours(puzzleHeroSettingsDto.endTime.getHours(), puzzleHeroSettingsDto.endTime.getMinutes(), 0);
        const scoreboardEndDate = puzzleHeroSettingsDto.scoreboardEndDate;
        scoreboardEndDate.setHours(
            puzzleHeroSettingsDto.scoreboardEndTime.getHours(),
            puzzleHeroSettingsDto.scoreboardEndTime.getMinutes(),
            0
        );

        return {
            open: puzzleHeroSettingsDto.open,
            releaseDate,
            endDate,
            scoreboardEndDate
        };
    }
}
