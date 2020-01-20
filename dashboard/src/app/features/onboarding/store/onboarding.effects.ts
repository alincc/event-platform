import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { OnboardAttendee, OnboardingActionTypes, OnboardSuccess, OnboardFailure } from "./onboarding.actions";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { EventService } from "src/app/providers/event.service";
import { LoadCurrentAttendee, AppActionTypes, CurrentAttendeeLoaded } from "src/app/store/app.actions";
import { Router } from "@angular/router";

@Injectable()
export class OnboardingEffects {
    constructor(private actions$: Actions,
                private translateService: TranslateService,
                private toastr: ToastrService,
                private eventService: EventService,
                private router: Router) { }

    @Effect()
    update$ = this.actions$.pipe(
        ofType<OnboardAttendee>(OnboardingActionTypes.OnboardAttendee),
        switchMap((action: OnboardAttendee) => 
            this.eventService.onboardAttendee(action.payload).pipe(
                map(() => new OnboardSuccess()),
                catchError(() => of(new OnboardFailure()))
            )
        )
    );

    @Effect({ dispatch: false })
    updateFail$ = this.actions$.pipe(
        ofType<OnboardFailure>(OnboardingActionTypes.OnboardFailure),
        tap(() => {
            const text = this.translateService.instant("components.toast.attendee_failed");
            this.toastr.error(text);
        })
    );

    @Effect()
    updateSuccess$ = this.actions$.pipe(
        ofType<OnboardSuccess>(OnboardingActionTypes.OnboardSuccess),
        map(() => new LoadCurrentAttendee())
    );

    @Effect({ dispatch: false })
    attendeeLoaded$ = this.actions$.pipe(
        ofType<CurrentAttendeeLoaded>(AppActionTypes.CurrentAttendeeLoaded),
        tap(() => this.router.navigate(["/"])),
    );
}
