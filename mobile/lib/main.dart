import 'package:CSGamesApp/delegates/localization.delegate.dart';
import 'package:CSGamesApp/redux/middlewares/activities-schedule-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/activities-subscription-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/activity-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/attendee-retrieval-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/login-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/notification-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/profile-middleware.dart';
import 'package:CSGamesApp/redux/middlewares/sponsors-middleware.dart';
import 'package:CSGamesApp/redux/states/activities-schedule-state.dart';
import 'package:CSGamesApp/redux/states/activities-subscription-state.dart';
import 'package:CSGamesApp/redux/states/activity-state.dart';
import 'package:CSGamesApp/redux/states/attendee-retrieval-state.dart';
import 'package:CSGamesApp/redux/states/event-state.dart';
import 'package:CSGamesApp/redux/states/login-state.dart';
import 'package:CSGamesApp/redux/states/notification-state.dart';
import 'package:CSGamesApp/redux/states/profile-state.dart';
import 'package:CSGamesApp/redux/states/sponsors-state.dart';
import 'package:CSGamesApp/services/activities.service.dart';
import 'package:CSGamesApp/services/notification.service.dart';
import 'package:CSGamesApp/services/schedule.service.dart';
import 'package:CSGamesApp/services/sponsors.service.dart';
import 'package:CSGamesApp/utils/http-client.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:qr_reader/qr_reader.dart';
import 'package:redux/redux.dart';
import 'package:CSGamesApp/pages/event.dart';
import 'package:CSGamesApp/pages/event-list.dart';
import 'package:CSGamesApp/pages/login.dart';
import 'package:CSGamesApp/services/attendees.service.dart';
import 'package:CSGamesApp/services/auth.service.dart';
import 'package:CSGamesApp/services/events.service.dart';
import 'package:CSGamesApp/services/nfc.service.dart';
import 'package:CSGamesApp/services/token.service.dart';
import 'package:CSGamesApp/services/users.service.dart';
import 'package:CSGamesApp/utils/constants.dart';
import 'package:CSGamesApp/utils/routes.dart';
import 'package:CSGamesApp/redux/middlewares/event-middleware.dart';
import 'package:CSGamesApp/redux/reducers/app-state-reducer.dart';
import 'package:CSGamesApp/redux/state.dart';
import 'package:redux_epics/redux_epics.dart';

void main() {
    final client = Client();
    final nfcService = NfcService();
    final qrCodeReader = QRCodeReader();
    final scheduleService = ScheduleService();
    final tokenService = TokenService(client);
    final firebaseMessaging = FirebaseMessaging();
    final httpClient = HttpClient(client, tokenService);
    final authService = AuthService(client, tokenService);
    final usersService = UsersService(httpClient);
    final eventsService = EventsService(httpClient);
    final sponsorsService = SponsorsService(httpClient);
    final attendeesService = AttendeesService(httpClient);
    final activitiesService = ActivitiesService(httpClient);
    final notificationService = NotificationService(httpClient);
    final store = Store<AppState>(
        appReducer,
        initialState: AppState(
            eventState: EventState.loading(),
            loginState: LoginState.initial(),
            profileState: ProfileState.initial(),
            activityState: ActivityState.initial(),
            sponsorsState: SponsorsState.initial(),
            notificationState: NotificationState.initial(),
            attendeeRetrievalState: AttendeeRetrievalState.initial(),
            activitiesScheduleState: ActivitiesScheduleState.initial(),
            activitiesSubscriptionState: ActivitiesSubscriptionState.initial()
        ),
        middleware: [
            EpicMiddleware<AppState>(SponsorsMiddleware(sponsorsService)),
            EpicMiddleware<AppState>(EventMiddleware(eventsService, tokenService)),
            EpicMiddleware<AppState>(ActivityDescriptionMiddleware(activitiesService)),
            EpicMiddleware<AppState>(ActivitiesScheduleMiddleware(eventsService, scheduleService)),
            EpicMiddleware<AppState>(LoginMiddleware(authService, firebaseMessaging, attendeesService)),
            EpicMiddleware<AppState>(ProfileMiddleware(tokenService, qrCodeReader, attendeesService, eventsService)),
            EpicMiddleware<AppState>(NotificationMiddleware(notificationService, firebaseMessaging, attendeesService)),
            EpicMiddleware<AppState>(ActivityMiddleware(eventsService, nfcService, attendeesService, usersService, activitiesService)),
            EpicMiddleware<AppState>(AttendeeRetrievalMiddleware(nfcService, attendeesService, eventsService, usersService, qrCodeReader))
        ]
    );
    runApp(CSGamesApp(store));
}

class CSGamesApp extends StatelessWidget {
    final Store<AppState> store;

    CSGamesApp(this.store);

    @override
    Widget build(_) {
        return StoreProvider(
            store: store,
            child: MaterialApp(
                title: 'PolyHx',
                debugShowCheckedModeBanner: false,
                theme: ThemeData(
                    platform: TargetPlatform.android,
                    accentColor: Colors.lightBlue,
                    buttonColor: Constants.csRed,
                    hintColor: Constants.polyhxGrey,
                    primaryColor: Constants.csRed,
                    scaffoldBackgroundColor: Colors.white,
                    textSelectionColor: Constants.csRed
                ),
                home: EventList(),
                onGenerateRoute: (RouteSettings routeSettings) {
                    String path = routeSettings.name.split('/')[0];
                    switch (path) {
                        case Routes.LOGIN:
                            return MaterialPageRoute(
                                builder: (_) => LoginPage(),
                                settings: routeSettings
                            );
                        case Routes.HOME:
                            return MaterialPageRoute(
                                builder: (_) => EventList(),
                                settings: routeSettings
                            );
                        case Routes.EVENT:
                            return MaterialPageRoute(
                                builder: (_) => EventPage(),
                                settings: routeSettings
                            );
                    }
                },
                localizationsDelegates: [
                    LanguageDelegate(),
                    GlobalMaterialLocalizations.delegate,
                    GlobalWidgetsLocalizations.delegate
                ],
                supportedLocales: [Locale('en', 'CA'), Locale('fr', 'CA')]
            )
        );
    }
}