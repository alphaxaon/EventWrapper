//=============================================================================
// EventWrapper.js
//=============================================================================

/*:
 * @plugindesc A simple wrapper for creating and handling events in your plugins. Press Help to see usage info.
 * @author Alphaxaon
 *
 * @help // Create a new event
 * var event = new MapEvent();
 *
 * // Copy actions from another event with the specified id
 * event.copyActionsFromEvent(1);
 *
 * // Copy actions from another event that exists on the map with the specified id
 * event.copyActionsFromEventOnMap(1, 4);
 *
 * // Copy actions from a Common Event with the specified id
 * event.copyActionsFromCommonEvent(1);
 * 
 * // Spawn the event at the specified coordinates
 * event.spawn(11, 7);
 */

"use strict";

class MapEvent {
    /**
     * The constructor for a new map event.
     */
    constructor() {
        var id = this.setId();

        this.data = {
            id: id,
            name: "EV" + id.padZero(3),
            note: "",
            pages: [],
            x: 0,
            y: 0,
            meta: {},
        };

        this.addPage();
    }

    /**
     * Automatically set the id for the event.
     */
    setId() {
        return $dataMap.events.length;
    }

    /**
     * Add a new page for the event's actions.
     */
    addPage() {
        this.data.pages.push({
            conditions: this.setDefaultConditions(),
            directionFix: false,
            image: this.setDefaultImage(),
            list: [],
            moveFrequency: 3,
            moveRoute: this.setDefaultMoveRoute(),
            moveSpeed: 3,
            moveType: 0,
            priorityType: 0,
            stepAnime: false,
            through: false,
            trigger: 0,
            walkAnime: true
        });
    }

    /**
     * Set the default event conditions for a page of actions.
     */
    setDefaultConditions() {
        return {
            actorId: 1,
            actorValid: false,
            itemId: 1,
            itemValid: false,
            selfSwitchCh: "A",
            selfSwitchValid: false,
            switch1Id: 1,
            switch1Valid: false,
            switch2Id: 1,
            switch2Valid: false,
            switch3Id: 1,
            switch3Valid: false,
            switch4Id: 1,
            switch4Valid: false,
            variableValue: 0
        };
    }

    /**
     * Set the default event image for a page of actions.
     */
    setDefaultImage() {
        return {
            characterIndex: 0,
            characterName: "",
            direction: 2,
            pattern: 0,
            tileId: 0
        };
    }

    /**
     * Set the default move route for a page of actions.
     */
    setDefaultMoveRoute() {
        return {
            list: [
                {
                    code: 0,
                    parameters: []
                }
            ],
            repeat: true,
            skippable: false,
            wait: false
        };
    }

    /**
     * Set the name of the event.
     *
     * @param name (string)
     */
    setName(name) {
    	this.data.name = name;
    }

    /**
     * Set the note of the event.
     *
     * @param note (string)
     */
    setNote(note) {
    	this.data.note = note;
    }

    /**
     * Set the map coordinates of the event.
     *
     * @param x (int)
     * @param y (int)
     */
    setPosition(x, y) {
        this.data.x = x;
        this.data.y = y;
    }

    /**
     * Get the last Event object stored in $dataMap.
     */
    getLastEvent() {
        return $dataMap.events[$dataMap.events.length - 1];
    }

    /**
     * Create a new Game_Event object and store it in $gameMap.
     */
    createGameEvent() {
        $gameMap._events.push(new Game_Event($gameMap._mapId, this.data.id));

        return $gameMap.event(this.data.id);
    }

    /**
     * Create a new Sprite_Character and store it in the current scene's Spriteset_Map.
     *
     * @param event (Game_Event)
     */
    createCharacterSprite(event) {
        SceneManager._scene._spriteset._characterSprites.push(new Sprite_Character(event));

        return SceneManager._scene._spriteset._characterSprites[SceneManager._scene._spriteset._characterSprites.length - 1];
    }

    /**
     * Add a sprite to the current scene's Tilemap.
     *
     * @param sprite (Sprite_Character)
     */
    addSpriteToTilemap(sprite) {
        SceneManager._scene._spriteset._tilemap.addChild(sprite);
    }

    /**
     * Copy actions from another event on the same map with the specified id.
     *
     * @param id (int)
     */
    copyActionsFromEvent(id) {
        this.data.pages = $dataMap.events[id].pages;
    }

    /**
     * Copy actions from another event on map with the specified id.
     *
     * @param id (int)
     * @param mapId (int)
     */
    copyActionsFromEventOnMap(id, mapId) {
        var url = 'data/Map%1.json'.format(mapId.padZero(3));
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');

        xhr.onload = function() {
            if (xhr.status < 400) {
                var mapData = JSON.parse(xhr.responseText);

                if (! (id in mapData.events))
                    console.error('Error getting event data. Check to make sure an event with that specific id exists on the map.');

                else
                    this.data.pages = mapData.events[id].pages;
            }
        }.bind(this);

        xhr.onerror = function() {
            console.error('Error getting map data. Check to make sure a map with that specific id exists.');
        };

        xhr.send();
    }

    /**
     * Copy actions from a Common Event with the specified id.
     *
     * @param id (int)
     */
    copyActionsFromCommonEvent(id) {
        this.data.pages = [];
        this.addPage();

        this.data.pages[0].list = $dataCommonEvents[id].list;
    }

    /**
     * Place the event on the map at the specified coordinates.
     *
     * @param x (int)
     * @param y (int)
     */
    spawn(x, y) {
        this.setPosition(x, y);

        $dataMap.events.push(this.data);
        var event = this.createGameEvent();
        var sprite = this.createCharacterSprite(event);
        this.addSpriteToTilemap(sprite);
        
        console.log('New event created!');
    }
}

/**
 * Hook into original functions.
 */
(function() {
    // Extend the clearTransferInfo function
    var clearTransferInfo = Game_Player.prototype.clearTransferInfo;

    // When a transfer is complete and info is being cleared
    Game_Player.prototype.clearTransferInfo = function() {
        clearTransferInfo.call(this);

        // Get all existing event ids
        var eventIds = [];
        $dataMap.events.forEach(function(object) {
            if (object === null)
                return;

            eventIds.push(object.id);
        });
        
        // Clear self switches for non-existing events
        for (var key in $gameSelfSwitches._data) {
            var ids = key.split(',');
            var mapId = Number(ids[0]);
            var eventId = Number(ids[1]);

            if (mapId != $gameMap._mapId)
                continue;

            if (!eventIds.contains(eventId))
                delete $gameSelfSwitches._data[key];
        }
    };
})();