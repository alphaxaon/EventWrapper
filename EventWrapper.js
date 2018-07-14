//=============================================================================
// EventWrapper.js
//=============================================================================

/*:
 * @plugindesc A simple wrapper for creating and handling events in your plugins. Press Help to see usage info.
 * @author Alphaxaon
 *
 * @help // Create a new event
 * var event = new MapEvent("Event Name");
 * 
 * // Spawn the event at the specified coordinates
 * event.spawn(11, 7);
 */

"use strict";

class MapEvent {
    /**
     * The constructor for a new map event.
     *
     * @param name (string)
     */
    constructor(name) {
        this.data = {
    		id: this.setId(),
        	name: name,
        	note: "",
        	pages: this.setPages(),
        	x: 0,
        	y: 0,
    		meta: {},
        };
    }

    /**
     * Automatically set the id for the event.
     */
    setId() {
    	return $dataMap.events.length;
    }

    /**
     * Setup the pages object for the event.
     */
    setPages() {
    	return this.getLastEvent().pages;
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