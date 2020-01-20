import { Component, OnInit, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as fromTracks from "../puzzle-hero/tracks/store/tracks.reducer";
import * as fromSchedule from "../schedule/store/schedule.reducer";
import * as fromCompetitions from "../competitions/list/store/competitions-list.reducer";
import { LoadStarredTracks, LoadTracks, StarTrack } from "../puzzle-hero/tracks/store/tracks.actions";
import { Track } from "src/app/api/models/puzzle-hero";
import { LoadActivities, ShowActivityInfo } from "../schedule/store/schedule.actions";
import { ScheduleService } from "src/app/providers/schedule.service";
import { Subscription } from "rxjs";
import { Activity } from "src/app/api/models/activity";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
import { LoadCompetitions } from "../competitions/list/store/competitions-list.actions";
import { Competition } from "src/app/api/models/competition";
import { CompetitionsService } from "src/app/providers/competitions.service";

@Component({
    selector: "app-home",
    templateUrl: "home.template.html",
    styleUrls: ["home.style.scss"]
})

export class HomeComponent implements OnInit, OnDestroy {
    public starredTracks$ = this.store$.pipe(select(fromTracks.getPuzzleHeroStarredTracks));
    public activities$ = this.store$.pipe(select(fromSchedule.getActivities));
    public competitions$ = this.store$.pipe(select(fromCompetitions.getCompetitions));
    
    public openTracks: Track[] = [];
    public nextActivities: Activity[];
    public nextCompetitions: Competition[];
    
    private activitiesSub$: Subscription;
    private competitionsSub$: Subscription;

    constructor(private store$: Store<
                    fromCompetitions.State &
                    fromTracks.State &
                    fromSchedule.State
                >,
                private scheduleService: ScheduleService,
                private translateService: TranslateService,
                private competitionsService: CompetitionsService) { }

    ngOnInit() {
        this.store$.dispatch(new LoadTracks());
        this.store$.dispatch(new LoadStarredTracks());
        this.store$.dispatch(new LoadActivities());
        this.store$.dispatch(new LoadCompetitions());
        this.activitiesSub$ = this.activities$.subscribe((activities) => {
            this.nextActivities = this.scheduleService.getNextActivities(activities);
        });
        this.competitionsSub$ = this.competitions$.subscribe((competitions) => {
            this.nextCompetitions = this.competitionsService.getNextCompetitions(competitions);
        });
    }

    public ngOnDestroy() {
        this.activitiesSub$.unsubscribe();
        this.competitionsSub$.unsubscribe();
    }

    clickStar(track: Track) {
        this.store$.dispatch(new StarTrack(track));
    }
    
    trackOpenChange(track: Track, open: boolean) {
        if (open) {
            this.openTracks.push(track);
        } else {
            this.openTracks = this.openTracks.filter(t => t._id !== track._id);
        }
    }
    
    isTrackOpen(track: Track): boolean {
        return !!this.openTracks.find(t => t._id === track._id);
    }
    
    public onShowInfo(activity: Activity) {
        const date = new Date(activity.beginDate);
        const time = formatDate(date, "h:mm a", this.translateService.getDefaultLang(), "utc");
        this.store$.dispatch(new ShowActivityInfo({activity, time}));
    }

    public getTime(activity: Activity): string {
        const date = new Date(activity.beginDate);
        return formatDate(date, "h:mm a", this.translateService.getDefaultLang(), "utc");
    }
}
