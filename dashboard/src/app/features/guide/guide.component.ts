import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/app.reducers";
import { TranslateService } from "@ngx-translate/core";
import { MouseEvent } from '@agm/core';
import * as fromApp from "../../store/app.reducers";
import { Subscription } from "rxjs";
import { Event } from "src/app/api/models/event";
import { getGuideState, GuideState, getGuideLoading, getGuide } from "./store/guide.reducer";
import { EventGuide } from "src/app/api/models/guide";
import { LoadGuide } from "./store/guide.actions";


@Component({
    selector: "app-guide",
    templateUrl: "guide.template.html",
    styleUrls: ["guide.style.scss"]
})
export class GuideComponent implements OnInit {
    
    private currentGuide$ = this.store$.pipe(select(getGuide));
    loading$ = this.store$.pipe(select(getGuideLoading));
    private currentGuideSub$: Subscription;
    private guide: EventGuide;

    constructor(private store$: Store<State>,
                private translateService: TranslateService) {}

    public ngOnInit() { 
        this.store$.dispatch(new LoadGuide());
        
        this.currentGuideSub$ = this.currentGuide$.subscribe((guide: EventGuide) => {
            this.guide = guide;
        });

        

    }

    public lang() {
        return this.translateService.defaultLang;
    }
}