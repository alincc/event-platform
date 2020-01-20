import { CreateAttendeeDto } from "./attendee";

export interface RegisterAttendeeDto {
    uuid: string;
    username: string;
    password: string;
    attendee: CreateAttendeeDto;
}

export interface CreateInvitationDto {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    teamName?: string;
    schoolId?: string;
    sponsorId?: string;
    maxMembersNumber?: number;
    showOnScoreboard?: boolean;
}

export class RegisterRoleDto {
    role: string;
    username: string;
    password: string;
    attendee: CreateAttendeeDto;
}
