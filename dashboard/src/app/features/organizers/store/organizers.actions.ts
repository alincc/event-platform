import { Action } from "@ngrx/store";
import { Attendee } from "../../../api/models/attendee";
import { RegisterAttendeeFormDto } from "../../../components/register-attendee-form/dto/register-attendee-form.dto";

export enum OrganizersActionTypes {
    LoadAdmins = "[Organizers] Load Admins",
    AdminsLoaded = "[Organizers] Admins loaded",
    AddAdmin = "[Organizers] Add admin"
}

export class LoadAdmins implements Action {
    readonly type = OrganizersActionTypes.LoadAdmins;
}

export class AdminsLoaded implements Action {
    readonly type = OrganizersActionTypes.AdminsLoaded;

    constructor(public payload: Attendee[]) {}
}

export class AddAdmin implements Action {
    readonly type = OrganizersActionTypes.AddAdmin;

    constructor(public payload: RegisterAttendeeFormDto) {}
}

export type OrganizersActions =
    | LoadAdmins
    | AdminsLoaded
    | AddAdmin;
