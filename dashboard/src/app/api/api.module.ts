import { NgModule } from "@angular/core";
import { ApiService } from "./api.service";
import { AuthApi } from "./auth.api";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AttendeeApi } from "./attendee.api";
import { EventApi } from "./event.api";
import { EventInterceptor } from "./interceptors/event.interceptor";
import { RegistrationApi } from "./registration.api";
import { PasswordApi } from "./password.api";
import { TeamApi } from "./team.api";
import { UserApi } from "./user.api";
import { SchoolApi } from "./school.api";
import { PuzzleHeroApi } from "./puzzle-hero.api";
import { ActivityApi } from "./activity.api";
import { FlashoutApi } from "./flashout.api";
import { CompetitionApi } from "./competition.api";
import { SponsorApi } from "./sponsor.api";

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: EventInterceptor, multi: true },
        AuthApi,
        AttendeeApi,
        EventApi,
        RegistrationApi,
        PasswordApi,
        SchoolApi,
        TeamApi,
        PuzzleHeroApi,
        ApiService,
        UserApi,
        ActivityApi,
        CompetitionApi,
        FlashoutApi,
        SponsorApi
    ]
})
export class ApiModule {}
