import 'package:CSGamesApp/domain/event.dart';
import 'package:CSGamesApp/redux/actions/event-actions.dart';
import 'package:redux/redux.dart';

final currentEventReducer = combineReducers<Event>([
  TypedReducer<Event, SetCurrentEventAction>(_setCurrentEvent),
  TypedReducer<Event, ResetAction>(_setNoEvent)
]);
 
Event _setCurrentEvent(_, SetCurrentEventAction action) {
  return action.event;
}

Event _setNoEvent(_, ResetAction action) {
    return null;
}
