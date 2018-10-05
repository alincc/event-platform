import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { STSService } from '@polyhx/nest-services';
import { GetAllWithIdsResponse } from '@polyhx/nest-services/modules/sts/sts.service';
import { Model } from 'mongoose';
import { CodeException } from '../../../filters/CodedError/code.exception';
import { DataTableInterface, DataTableReturnInterface } from '../../../interfaces/dataTable.interface';
import { BaseService } from '../../../services/base.service';
import { EmailService } from '../../email/email.service';
import { CreateActivityDto } from '../activities/activities.dto';
import { ActivitiesService } from '../activities/activities.service';
import { AttendeesService } from '../attendees/attendees.service';
import { CreateEventDto } from './events.dto';
import { Code } from './events.exception';
import { Events } from './events.model';

@Injectable()
export class EventsService extends BaseService<Events, CreateEventDto> {
    constructor(@InjectModel('events') private readonly eventsModel: Model<Events>,
                private attendeeService: AttendeesService,
                private emailService: EmailService,
                private stsService: STSService,
                private activitiesService: ActivitiesService) {
        super(eventsModel);
    }

    async addAttendee(eventId: string, userId: string) {
        let attendee = await this.attendeeService.findOne({userId});

        if (!attendee) {
            throw new CodeException(Code.USER_NOT_ATTENDEE);
        }

        const attendeeAlreadyRegistered = (await this.eventsModel.count({
            _id: eventId,
            'attendees.attendee': attendee._id
        }).exec()) > 0;

        if (attendeeAlreadyRegistered) {
            throw new CodeException(Code.ATTENDEE_ALREADY_REGISTERED);
        }

        return this.eventsModel.update({
            _id: eventId
        }, {
            $push: {
                attendees: {
                    attendee: attendee._id
                }
            }
        }).exec();
    }

    async confirmAttendee(eventId: string, userId: string, attending: boolean) {
        let attendee = await this.attendeeService.findOne({userId});

        if (!attendee) {
            throw new CodeException(Code.USER_NOT_ATTENDEE);
        }

        const event = await this.eventsModel.findOne({
            _id: eventId
        });

        const attendeeRegistration = event.attendees.find(r => r.attendee.toString() === attendee._id.toString());

        if (!attendeeRegistration.selected) {
            throw new CodeException(Code.ATTENDEE_NOT_SELECTED);
        }

        event.attendees.splice(event.attendees.indexOf(attendeeRegistration), 1);

        if (attending) {
            attendeeRegistration.confirmed = true;
            attendeeRegistration.declined = false;
        } else {
            attendeeRegistration.confirmed = false;
            attendeeRegistration.declined = true;
        }

        event.attendees.push(attendeeRegistration);
        await event.save();
    }

    async hasAttendeeForUser(eventId: string, userId: string) {
        let attendee = await this.attendeeService.findOne({userId});

        if (!attendee) {
            throw new CodeException(Code.USER_NOT_ATTENDEE);
        }

        return this.hasAttendee(eventId, attendee._id);
    }

    async hasAttendee(eventId: string, attendeeId: string) {
        const occurrencesOfAttendee = await this.eventsModel.count({
            _id: eventId,
            'attendees.attendee': attendeeId
        }).exec();

        return occurrencesOfAttendee > 0;
    }

    async getAttendeeStatus(attendeeId: string, eventId: string) {
        const event = await this.findOne({_id: eventId});
        return this.getAttendeeStatusFromEvent(attendeeId, event);
    }

    public getAttendeeStatusFromEvent(attendeeId: string, event: Events) {
        const status = event.attendees.find(a => a.attendee.toString() === attendeeId.toString());
        if (!status) {
            return 'not-registered';
        }
        if (status.confirmed) {
            return 'confirmed';
        } else if (status.declined) {
            return 'declined';
        } else if (status.selected) {
            return 'selected';
        } else if (status.present) {
            return 'present';
        } else {
            return 'registered';
        }
    }

    /**
     * From the attendees of a specified event (null-checked), filters them and returns the result as a promise of
     * DataTableReturnInterface.
     */
    async getFilteredAttendees(eventId: string, filter: DataTableInterface): Promise<DataTableReturnInterface> {
        const event: Events = await this.findOne({_id: eventId});
        if (!event) {
            throw new NotFoundException(`Event not found. (EventId: ${eventId})`);
        }

        let selected = false;
        let selectedValue = false;
        let confirmed = false;
        let confirmedValue = false;
        let declined = false;
        let declinedValue = false;

        if (filter.rules) {
            for (let rule of filter.rules.rules) {
                if (rule.id === 'selected') {
                    selected = true;
                    selectedValue = rule.value === '1';
                } else if (rule.id === 'confirmed') {
                    confirmed = true;
                    confirmedValue = rule.value === '1';
                } else if (rule.id === 'declined') {
                    declined = true;
                    declinedValue = rule.value === '1';
                }
            }
        }

        let attendeeIds: string[] = event.attendees.map(attendee => {
            if ((selected && attendee.selected === selectedValue)) {
                if (!confirmed && !declined) {
                    return attendee.attendee.toString();
                }

                if ((confirmed && attendee.confirmed === confirmedValue)) {
                    if (!declined) {
                        return attendee.attendee.toString();
                    }

                    if ((declined && attendee.declined === declinedValue)) {
                        return attendee.attendee.toString();
                    }
                }

                if ((declined && attendee.declined === declinedValue)) {
                    return attendee.attendee.toString();
                }

            } else if ((confirmed && attendee.confirmed === confirmedValue)) {
                if (!selected && !declined) {
                    return attendee.attendee.toString();
                }

                if ((selected && attendee.selected === selectedValue)) {
                    if (!declined) {
                        return attendee.attendee.toString();
                    }

                    if ((declined && attendee.declined === declinedValue)) {
                        return attendee.attendee.toString();
                    }
                }

                if ((declined && attendee.declined === declinedValue)) {
                    return attendee.attendee.toString();
                }

            } else if ((declined && attendee.declined === declinedValue)) {
                if (!selected && !confirmed) {
                    return attendee.attendee.toString();
                }

                if ((selected && attendee.selected === selectedValue)) {
                    if (!confirmed) {
                        return attendee.attendee.toString();
                    }

                    if ((confirmed && attendee.confirmed === confirmedValue)) {
                        return attendee.attendee.toString();
                    }
                }

                if ((confirmed && attendee.confirmed === confirmedValue)) {
                    return attendee.attendee.toString();
                }

            } else if (!selected && !confirmed && !declined) {
                return attendee.attendee.toString();
            }
        });

        let res = await this.attendeeService.filterFrom(attendeeIds, filter);

        for (let attendee of res.data) {
            let a = event.attendees[
                event.attendees.findIndex(value => value.attendee.toString() === attendee._id.toString())
                ];

            if (a.confirmed) {
                attendee.status = 'confirmed';
            } else if (a.declined) {
                attendee.status = 'declined';
            } else if (a.selected) {
                attendee.status = 'selected';
            } else if (a.present) {
                attendee.status = 'present';
            } else {
                attendee.status = 'registered';
            }
        }

        return res;
    }

    async selectAttendees(eventId, userIds: string[]) {
        const res: GetAllWithIdsResponse = await this.stsService.getAllWithIds(userIds);

        for (const user of res.users) {
            try {
                await this.emailService.sendEmail({
                    from: 'PolyHx <info@polyhx.io>',
                    to: [user.username],
                    subject: 'LHGames 2018 - Selection',
                    text: 'LHGames 2018 - Selection',
                    html: '<h1>Congrats</h1>',
                    template: 'lhgames2018-selection',
                    variables: {
                        name: user.firstName
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

        const attendees = await this.attendeeService.find({
            userId: {
                $in: userIds
            }
        });
        for (const attendee of attendees) {
            await this.eventsModel.update({
                '_id': eventId,
                'attendees.attendee': attendee._id
            }, {
                'attendees.$.selected': true
            }).exec();
        }

        return {};
    }

    async getFilteredActivities(eventId: string, filter: DataTableInterface): Promise<DataTableReturnInterface> {
        const event: Events = await this.findOne({_id: eventId});
        if (!event) {
            throw new NotFoundException(`Event not found. (EventId: ${eventId})`);
        }

        return this.activitiesService.filterFrom(event.activities as string[], filter);
    }

    async createActivity(id: string, dto: CreateActivityDto) {
        const event = await this.findById(id);
        if (!event) {
            throw new NotFoundException('No event found');
        }

        const activity = await this.activitiesService.create(dto);
        event.activities.push(activity._id);
        return await event.save();
    }

    async getActivities(eventId: string) {
        const event = await this.findById(eventId);
        if (!event) {
            throw new NotFoundException('No event found');
        }

        return await this.activitiesService.find({
            _id: {
                $in: event.activities
            }
        });
    }

    async getStats(eventId: string) {
        const event = await this.findById(eventId);
        const activities = await this.getActivities(eventId);

        const stats = {};
        stats['registered'] = event.attendees.length;
        stats['selected'] = event.attendees.filter(a => a.selected).length;
        stats['confirmed'] = event.attendees.filter(a => a.confirmed).length;
        stats['declined'] = event.attendees.filter(a => a.declined).length;
        stats['present'] = event.attendees.filter(a => a.present).length;

        stats['activities'] = activities.reduce((acc, a) => Object.assign(acc, {[a.name]: a.attendees.length}), {});

        return stats;
    }
}
