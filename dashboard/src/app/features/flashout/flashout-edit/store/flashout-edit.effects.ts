import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { FlashoutService } from "src/app/providers/flashout.service";
import { SchoolService } from "src/app/providers/school.service";
import { LoadFlashouts, FlashoutEditActionTypes, FlashoutsLoaded, LoadSchools, SchoolsLoaded, AddFlashout } from "./flashout-edit.actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { Flashout } from "src/app/api/models/flashout";
import { of } from "rxjs";
import { GlobalError } from "src/app/store/app.actions";
import { School } from "src/app/api/models/school";

@Injectable()
export class FlashoutEditEffects {
    constructor(private actions$: Actions,
                private flashoutService: FlashoutService,
                private schoolService: SchoolService) {}

    @Effect()
    loadFlashouts$ = this.actions$.pipe(
        ofType<LoadFlashouts>(FlashoutEditActionTypes.LoadFlashouts),
        switchMap(() =>
            this.flashoutService.getAllFlashouts().pipe(
                map((flashouts: Flashout[]) => new FlashoutsLoaded(flashouts)),
                catchError((err) => of(new GlobalError(err)))
            )
        )
    );

    @Effect()
    loadSchools$ = this.actions$.pipe(
        ofType<LoadSchools>(FlashoutEditActionTypes.LoadSchools),
        switchMap(() =>
            this.schoolService.getAllSchools().pipe(
                map((schools: School[]) => new SchoolsLoaded(schools)),
                catchError((e) => of(new GlobalError(e)))
            )
        )
    );

    @Effect()
    addFlashout$ = this.actions$.pipe(
        ofType<AddFlashout>(FlashoutEditActionTypes.AddFlashout),
        switchMap((action: AddFlashout) =>
            this.flashoutService.addFlashout(action.addFlashoutDto).pipe(
                map(() => new LoadFlashouts()),
                catchError((err) => of(new GlobalError(err)))
            )
        )
    );
}
