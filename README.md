# Event Wrapper

A simple class for creating and handling events dynamically in RPG Maker MV.

## Installation

Simply drop the file `EventWrapper.js` in your `js/plugins` folder and enable it through MV's Plugins Manager. Make sure to load it *before* any custom plugins that will be using the class. You can then create events quickly in any of your plugins.

## How To Use

First, create a new map event.

```
var event = new MapEvent("Event Name");
```

Grab some actions from an existing event on the same map. 

```
event.copyActionsFromEvent(EVENT_ID);
```

Alternatively, grab some actions from a Common Event.

```
event.copyActionsFromCommonEvent(EVENT_ID);
```

Spawn the event somewhere on your map.

```
event.spawn(X, Y);
```