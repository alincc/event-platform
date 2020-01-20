import { Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { Observable } from "rxjs";
import { Team } from "../api/models/team";
import { Attendee } from "../api/models/attendee";
import { EditTeamFormDto } from "../features/team/team-edit/components/edit-team-form/dto/edit-team-form.dto";

@Injectable()
export class TeamService {

    constructor(private apiService: ApiService) {
    }

    getTeam(): Observable<Team> {
        return this.apiService.team.getTeam();
    }

    getTeamById(id: string): Observable<Team> {
        return this.apiService.team.getTeamById(id);
    }

    updateTeamName(newName: string, id: string): Observable<void> {
        return this.apiService.team.updateTeamName(newName, id);
    }

    addTeamMember(newAttendee: Attendee, teamName: string, role: string, sponsorId?: string): Observable<any> {
        return this.apiService.registration.inviteAttendee({
            firstName: newAttendee.firstName,
            lastName: newAttendee.lastName,
            email: newAttendee.email,
            role: role,
            teamName: teamName,
            sponsorId
        });
    }

    addTeamGodparent(newGodparent: Attendee, teamName: string, role: string): Observable<any> {
        return this.apiService.registration.inviteAttendee({
            firstName: newGodparent.firstName,
            lastName: newGodparent.lastName,
            email: newGodparent.email,
            role: role,
            teamName: teamName
        });
    }

    deleteAttendeeFromTeam(attendeeId: string, teamId: string): Observable<void> {
        return this.apiService.team.deleteAttendeeFromTeam(attendeeId, teamId);
    }

    updateTeam(id: string, team: EditTeamFormDto): Observable<void> {
        return this.apiService.team.updateTeam(id, team);
    }
}
