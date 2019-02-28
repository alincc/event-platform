import { Body, Controller, Post, UseGuards, UseFilters, Get, Param } from '@nestjs/common';
import { Permissions } from '../../../decorators/permission.decorator';
import { PermissionsGuard } from '../../../guards/permission.guard';
import { ValidationPipe } from "../../../pipes/validation.pipe";
import { CreateRegistrationGuard } from './registrations.guard';
import { Registrations } from './registrations.model';
import { RegistrationsService } from "./registrations.service";
import { CreateRegistrationDto, RegisterAdminDto, RegisterAttendeeDto } from './registrations.dto';
import { PublicRoute } from 'nestjs-jwt2';
import { Role } from '../../../decorators/role.decorator';
import { CodeExceptionFilter } from '../../../filters/code-error/code.filter';
import { codeMap } from './registration.exception';
import { EventId } from '../../../decorators/event-id.decorator';

@Controller("registration")
@UseFilters(new CodeExceptionFilter(codeMap))
@UseGuards(PermissionsGuard)
export class RegistrationsController {
    constructor(private readonly registrationService: RegistrationsService) { }

    @Post()
    @UseGuards(CreateRegistrationGuard)
    @Permissions('csgames-api:create:invitation')
    public async createInvitation(@Body(new ValidationPipe()) dto: CreateRegistrationDto,
                                  @Role() role: string,
                                  @EventId() eventId: string
    ): Promise<Registrations> {
        return await this.registrationService.create(dto, role, eventId);
    }

    @Post('attendee')
    @PublicRoute()
    public async registerAttendee(@Body(new ValidationPipe()) user: RegisterAttendeeDto) {
        await this.registrationService.registerAttendee(user);
    }

    @Post('admin')
    @Permissions('csgames-api:create-admin:invitation')
    public async registerAdmin(@Body(new ValidationPipe()) user: RegisterAdminDto, @EventId() eventId: string) {
        await this.registrationService.registerUser(user, eventId, 'admin');
    }

    @Get(':uuid')
    @PublicRoute()
    public async getRegistrationInfo(@Param('uuid') uuid: string): Promise<Registrations> {
        return await this.registrationService.getRegistrationInfo(uuid);
    }
}
