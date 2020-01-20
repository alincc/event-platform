import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from "@angular/core";
import { SimpleModalService } from "ngx-simple-modal";
import { filter } from "rxjs/operators";
import { NotificationsListModalComponent } from "../../../../modals/notifications-list-modal/notifications-list-modal.component";
import { State } from "../../../../store/app.reducers";
import { select, Store } from "@ngrx/store";
import { Logout, ChangeLanguage, CheckUnseenNotification } from "../../../../store/app.actions";
import * as fromApp from "../../../../store/app.reducers";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { LANGUAGE } from "src/app/store/app.effects";

@Component({
    selector: "app-top-nav",
    templateUrl: "top-nav.template.html",
    styleUrls: ["./top-nav.style.scss"]
})

export class TopNavComponent implements OnInit, OnDestroy {
    @Input()
    public showToggleSideNav = false;

    @Input()
    public loading = false;

    @Output()
    public toggleSideNav = new EventEmitter<boolean>();
    @Output()
    public editProfile = new EventEmitter();
    @Output()
    public changePassword = new EventEmitter();
    @Output()
    public ticket = new EventEmitter();

    private _toggleSideNav = false;

    public currentAttendee$ = this.store$.pipe(select(fromApp.getCurrentAttendee));
    public currentEvent$ = this.store$.pipe(select(fromApp.getCurrentEvent));
    public language$ = this.store$.pipe(select(fromApp.getCurrentLanguage));
    public unseen$ = this.store$.pipe(select(fromApp.getUnseen));
    private language: string;
    public unseen: boolean;
    private languageSub$: Subscription;
    private currentEventSub$: Subscription;
    private unseenSub$: Subscription;

    constructor(
        private modalService: SimpleModalService,
        private store$: Store<State>,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.currentEventSub$ = this.currentEvent$.pipe(filter(e => !!e)).subscribe(() => {
            this.store$.dispatch(new CheckUnseenNotification());
        });
        this.languageSub$ = this.language$.subscribe((language) => {
            this.language = language;
        });

        this.unseenSub$ = this.unseen$.subscribe((unseen) => {
            this.unseen = unseen;
        });
    }

    ngOnDestroy() {
        this.languageSub$.unsubscribe();
        this.currentEventSub$.unsubscribe();
        this.unseenSub$.unsubscribe();
    }

    clickNotificationsButton() {
        this.modalService.addModal(NotificationsListModalComponent);
    }

    clickToggleSideNav() {
        this._toggleSideNav = !this._toggleSideNav;
        this.toggleSideNav.emit(this._toggleSideNav);
    }

    clickLogout() {
        this.store$.dispatch(new Logout());
    }

    changeLanguage() {
        if (!this.language) {
            const lang: string = localStorage.getItem(LANGUAGE) ? localStorage.getItem(LANGUAGE) : this.translateService.getBrowserLang();
            this.store$.dispatch(new ChangeLanguage(lang === "en" ? "fr" : "en"));
            return;
        }

        if (this.language === "fr") {
            this.store$.dispatch(new ChangeLanguage("en"));
        } else {
            this.store$.dispatch(new ChangeLanguage("fr"));
        }
    }
}
