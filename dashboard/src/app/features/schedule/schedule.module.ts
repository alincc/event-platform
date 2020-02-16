import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ScheduleRoutingModule } from "./schedule-routing.module";
import { DirectivesModule } from "src/app/directives/directives.module";
import { StoreModule } from "@ngrx/store";
import * as fromSchedule from "./store/schedule.reducer";
import { EffectsModule } from "@ngrx/effects";
import { ScheduleEffects } from "./store/schedule.effects";
import { ScheduleComponent } from "./schedule.component";
import { LoadingSpinnerModule } from "src/app/components/loading-spinner/loading-spinner.module";
import { TabsModule } from "ngx-bootstrap/tabs";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PipeModule } from "src/app/pipe/pipe.module";
import { SimpleModalModule } from "ngx-simple-modal";
import { InfoActivityModule } from "./info-activity/info-activity.module";
import { ActivityCardComponent } from "./activity-card/activity-card.component";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ScheduleRoutingModule,
        LoadingSpinnerModule,
        DirectivesModule,
        StoreModule.forFeature("schedule", fromSchedule.reducer),
        EffectsModule.forFeature([ScheduleEffects]),
        TabsModule.forRoot(),
        FlexLayoutModule,
        PipeModule,
        SimpleModalModule,
        InfoActivityModule
    ],
    declarations: [ScheduleComponent, ActivityCardComponent],
    entryComponents: [ScheduleComponent],
    exports: [ScheduleComponent, ActivityCardComponent]
})
export class ScheduleModule { }
