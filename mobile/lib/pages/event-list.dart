import 'package:CSGamesApp/redux/actions/login-actions.dart';
import 'package:CSGamesApp/redux/actions/notification-actions.dart';
import 'package:CSGamesApp/services/localization.service.dart';
import 'package:CSGamesApp/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:CSGamesApp/components/loading-spinner.dart';
import 'package:CSGamesApp/components/pagetransformer/eventpageitem.dart';
import 'package:CSGamesApp/components/pagetransformer/pagetransformer.dart';
import 'package:CSGamesApp/domain/event.dart';
import 'package:CSGamesApp/redux/actions/event-actions.dart';
import 'package:CSGamesApp/redux/state.dart';
import 'package:CSGamesApp/utils/routes.dart';
import 'package:redux/redux.dart';

class EventList extends StatelessWidget {
  bool _eventsChecked = false;

  Widget _buildEventCards(_EventListPageViewModel model, BuildContext context) {
    return model.hasErrors
      ? Text(LocalizationService.of(context).eventList['error'])
      : PageTransformer(
          pageViewBuilder: (_, visibilityResolver) {
            return PageView.builder(
              controller: PageController(viewportFraction: 0.85),
              itemCount: model.events != null ? model.events.length : 0,
              itemBuilder: (_, index) {
                model.events.sort((Event a, Event b) => b.beginDate.compareTo(a.beginDate));
                final item = model.events[index];
                final pageVisibility = visibilityResolver.resolvePageVisibility(index);
                return StoreConnector<AppState, VoidCallback>(
                  converter: (store) => () => store.dispatch(SetCurrentEventAction(item)),
                  builder: (BuildContext context, VoidCallback setCurrentEvent) {
                    return EventPageItem(
                      item: item,
                      pageVisibility: pageVisibility,
                      onTap: () {
                        setCurrentEvent();
                        Navigator.pushNamed(context, Routes.EVENT);
                      }
                    );
                  }
                );
              }
            );
          }
        );
  }



  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _EventListPageViewModel>(
      onInit: (store) async {
        IsLoggedInAction action = IsLoggedInAction();
        store.dispatch(action);
        action.completer.future.then((isLoggedIn) {
          final eventState = store.state.eventState;
          if (isLoggedIn && eventState.events.isEmpty && !eventState.hasErrors) {
              store.dispatch(LoadEventsAction());
              store.dispatch(SetupNotificationAction());
          } else if (!isLoggedIn) {
            Navigator.pushReplacementNamed(context, Routes.LOGIN);
          }
        });
      },
      converter: (store) => _EventListPageViewModel.fromStore(store),
      builder: (BuildContext _, _EventListPageViewModel model) {
        return model.isLoading
          ? Scaffold(body: Center(child: LoadingSpinner()))
          : Scaffold(
              appBar: AppBar(
                backgroundColor: Constants.csBlue,
                title: Text(
                  LocalizationService.of(context).eventList['title'],
                  style: TextStyle(
                    fontFamily: 'Raleway'
                  )
                ),
                actions: <Widget>[
                  IconButton(
                    icon: Icon(FontAwesomeIcons.signOutAlt),
                    color: Colors.white,
                    onPressed: () {
                      model.logOut(context);
                      model.reset();
                    }
                  )
                ]
              ),
              body: Center(
                child: SizedBox.fromSize(
                  child: _buildEventCards(model, context)
                )
              )
            );
      },
      onDidChange: (_EventListPageViewModel model) {
        if (model.events.isNotEmpty && !model.hasErrors && !model.isLoading && !_eventsChecked) {
          _eventsChecked = true;
          DateTime now = DateTime.now();
          for (Event event in model.events) {
            if (event.beginDate.isBefore(now) && event.endDate.isAfter(now)) {
              model.setCurrentEvent(event);
              Navigator.pushNamed(context, Routes.EVENT);
              break;
            }
          }
        }
      }
    );
  }
}

class _EventListPageViewModel {
  List<Event> events;
  bool isLoading;
  bool hasErrors;
  Function logOut;
  Function reset;
  Function setCurrentEvent;
  Function getCurrentAttendee;

  _EventListPageViewModel(
    this.events,
    this.isLoading,
    this.hasErrors,
    this.logOut,
    this.reset,
    this.setCurrentEvent,
    this.getCurrentAttendee
  );

  _EventListPageViewModel.fromStore(Store<AppState> store) {
    events = store.state.eventState.events;
    isLoading = store.state.eventState.isLoading;
    hasErrors = store.state.eventState.hasErrors;
    logOut = (context) => store.dispatch(LogOut(context));
    reset = () => store.dispatch(ResetAction());
    setCurrentEvent = (event) => store.dispatch(SetCurrentEventAction(event));
  }
}
