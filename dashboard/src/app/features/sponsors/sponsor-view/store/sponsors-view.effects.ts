import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { LoadSponsors, SponsorsViewActionTypes, SponsorsLoaded } from "./sponsors-view.actions";
import { map, catchError, switchMap } from "rxjs/operators";
import { SponsorsService } from "src/app/providers/sponsors.service";
import { Sponsors } from "src/app/api/models/sponsors";
import { GlobalError } from "src/app/store/app.actions";
import { of } from "rxjs";

@Injectable()
export class SponsorsViewEffects {
    constructor(private actions$: Actions,
                private sponsorsService: SponsorsService) { }

    @Effect()
    loadSponsors$ = this.actions$.pipe(
        ofType<LoadSponsors>(SponsorsViewActionTypes.LoadSponsors),
        switchMap(() => {
            return this.sponsorsService.getSponsorsList().pipe(
                map((s: { [id: string]: Sponsors[] }) => new SponsorsLoaded(s)),
                catchError((e) => of(new GlobalError(e)))
            );
        })
    );
}
