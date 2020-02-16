import { Routes } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DASHBOARD_ROUTES } from "./features/dashboard/dashboard.routes";
import { LoginComponent } from "./features/login/login.component";
import { RegisterComponent } from "./features/register/register.component";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { NotAuthenticatedGuard } from "./guards/not-authenticated.guard";
import { ForgetComponent } from "./features/forget/forget.component";
import { ResetComponent } from "./features/reset/reset.component";

export const ROUTES: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [NotAuthenticatedGuard]
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [NotAuthenticatedGuard]
    },
    {
        path: "forget",
        component: ForgetComponent,
        canActivate: [NotAuthenticatedGuard]
    },
    {
        path: "reset/:uuid",
        component: ResetComponent,
        canActivate: [NotAuthenticatedGuard]
    },
    // App components
    {
        path: "",
        component: DashboardComponent,
        children: DASHBOARD_ROUTES,
        canActivate: [AuthenticatedGuard]
    }
];
