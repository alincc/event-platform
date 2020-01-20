import { Routes } from "@angular/router";
import { NotRegisteredGuard } from "./utils/not-registered.guard";
import { RegisteredGuard } from "./utils/registered.guard";
import { FlashoutGuard } from "../flashout/guards/flashout.guard";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: "",
        redirectTo: "guide",
        pathMatch: "full"
    },
    // {
    //     path: "home",
    //     loadChildren: "src/app/features/home/home.module#HomeModule",
    //     canActivate: [RegisteredGuard]
    // },
    {
        path: "team",
        loadChildren: "src/app/features/team/team.module#TeamModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "puzzle-hero",
        loadChildren: "src/app/features/puzzle-hero/puzzle-hero.module#PuzzleHeroModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "onboarding",
        loadChildren: "src/app/features/onboarding/onboarding.module#OnboardingModule",
        canActivate: [NotRegisteredGuard]
    },
    {
        path: "guide",
        loadChildren: "src/app/features/guide/guide.module#GuideModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "sponsors",
        loadChildren: "src/app/features/sponsors/sponsor.module#SponsorModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "schedule",
        loadChildren: "src/app/features/schedule/schedule.module#ScheduleModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "competition",
        loadChildren: "src/app/features/competitions/competitions.module#CompetitionsModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "notifications",
        loadChildren: "src/app/features/notifications/notifications.module#NotificationsModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "flash-out",
        loadChildren: "src/app/features/flashout/flashout.module#FlashoutModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "user",
        redirectTo: "user/attendee",
        pathMatch: "full"
    },
    {
        path: "user/organizer",
        loadChildren: "src/app/features/organizers/organizers.module#OrganizersModule"
    },
    {
        path: "user/volunteer",
        loadChildren: "src/app/features/volunteers/volunteers.module#VolunteersModule"
    },
    {
        path: "user/director",
        loadChildren: "src/app/features/directors/directors.module#DirectorsModule"
    },
    {
        path: "user/attendee",
        loadChildren: "src/app/features/attendees/attendees.module#AttendeesModule"
    },
    {
        path: "activities",
        loadChildren: "src/app/features/activities/activities.module#ActivitiesModule",
        canActivate: [RegisteredGuard]
    },
    {
        path: "**",
        redirectTo: "guide",
        pathMatch: "full"
    }
];
