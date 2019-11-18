# Event Wrapper

A simple class for creating and handling events dynamically in RPG Maker MV.

## Installation

Simply drop the file `EventWrapper.js` in your `js/plugins` folder and enable it through MV's Plugins Manager. Make sure to load it *before* any custom plugins that will be using the class. You can then create events quickly in any of your plugins.

## How To Use

### 1. Create a new event

All you need is to create a new instance of the MapEvent object.

```
var event = new MapEvent();
```

### 2. Specify the event's actions

You can copy the actions from an existing event on the same map. 

```
event.copyActionsFromEvent(eventId);
```

Or an existing event on a different map.

```
event.copyActionsFromEventOnMap(eventId, mapId);
```

Or even a Common Event.

```
event.copyActionsFromCommonEvent(eventId);
```

### 3. Spawn the event

Just specify the map coordinates for your new event and you're golden!

```
event.spawn(x, y);
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
