import { AngularFireModule } from "@angular/fire";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AppComponent } from "./app.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import * as fromApp from "./store/app.reducers";
import { AppEffects } from "./store/app.effects";
import { RouterModule } from "@angular/router";
import { ROUTES } from "./app.routes";
import { DashboardModule } from "./features/dashboard/dashboard.module";
import { environment } from "../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { LoginModule } from "./features/login/login.module";
import { RegisterModule } from "./features/register/register.module";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule } from "./api/api.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "./providers/authentication.service";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { NotAuthenticatedGuard } from "./guards/not-authenticated.guard";
import { AttendeeService } from "./providers/attendee.service";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { TeamService } from "./providers/team.service";
import { EventService } from "./providers/event.service";
import { RegisterService } from "./providers/register.service";
import { ForgetModule } from "./features/forget/forget.module";
import { MarkdownModule } from "ngx-markdown";
import { PasswordService } from "./providers/password.service";
import { ToastrModule } from "ngx-toastr";
import { NgxMaskModule } from "ngx-mask";
import { ResetModule } from "./features/reset/reset.module";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { AlertModule } from "ngx-bootstrap/alert";
import { DatepickerModule, BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PopoverModule } from "ngx-bootstrap/popover";
import { SortableModule } from "ngx-bootstrap/sortable";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SponsorsService } from "./providers/sponsors.service";
import { ScheduleService } from "./providers/schedule.service";
import { RoleGuard } from "./guards/role.guard";
import { SchoolService } from "./providers/school.service";
import { PuzzleHeroService } from "./providers/puzzle-hero.service";
import { NotificationService } from "./providers/notification.service";
import { UpdateModule } from "./update/update.module";
import { FlashoutService } from "./providers/flashout.service";
import "brace";
import "brace/mode/markdown";
import "brace/theme/github";
import { CompetitionsService } from "./providers/competitions.service";
import { ActivityService } from "./providers/activity.service";
import { GuideService } from "./providers/guide.service";

export function loadFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, "../assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        PopoverModule.forRoot(),
        AlertModule.forRoot(),
        DashboardModule,
        LoginModule,
        RegisterModule,
        RouterModule.forRoot(ROUTES),
        AngularFireModule.initializeApp(environment.FIREBASE),
        AngularFireMessagingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: loadFactory,
                deps: [HttpClient]
            }
        }),
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        SortableModule.forRoot(),
        NgxMaskModule.forRoot(),
        TabsModule.forRoot(),
        MarkdownModule.forRoot(),
        ApiModule,
        ForgetModule,
        ResetModule,
        ServiceWorkerModule.register("/ngsw-worker.js", { enabled: environment.production }),
        StoreModule.forRoot(fromApp.appReducers, { metaReducers: fromApp.appMetaReducers }),
        EffectsModule.forRoot([
            AppEffects
        ]),
        StoreRouterConnectingModule.forRoot(),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MonacoEditorModule.forRoot(),
        NoopAnimationsModule,
        UpdateModule
    ],
    providers: [
        AuthenticationService,
        AttendeeService,
        EventService,
        AuthenticatedGuard,
        NotAuthenticatedGuard,
        RoleGuard,
        SchoolService,
        TeamService,
        RegisterService,
        PasswordService,
        SponsorsService,
        PuzzleHeroService,
        ScheduleService,
        NotificationService,
        FlashoutService,
        CompetitionsService,
        ActivityService,
        GuideService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
