/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.4.0:
		- created from DataManager
	- v1.5.0:
		- Issue #52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
Doc reviewed 20200731
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file DataSearchEngine.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@typedef {Object} NoteAndRoute
@desc An object to store a Note and the Route on witch the Note is attached
@property {?Note} note the searched Note or null if the note is not found
@property {?Route} route the Route on witch the Note is attached or null if the Note is a travel note
@public

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module DataSearchEngine
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import { theTravelNotesData } from '../data/TravelNotesData.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class DataSearchEngine
@classdesc Class with helper methods to search data
@see {@link theDataSearchEngine} for the one and only one instance of this class
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class DataSearchEngine {

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Search a route with the route objId
	@param {!number} objId the objId of the route to search
	@return (?Route) the searched route or null if not found
	*/

	getRoute ( routeObjId ) {
		let route = null;
		route = theTravelNotesData.travel.routes.getAt ( routeObjId );
		if ( ! route ) {
			if ( routeObjId === theTravelNotesData.travel.editedRoute.objId ) {
				route = theTravelNotesData.travel.editedRoute;
			}
		}
		return route;
	}

	/**
	Search a Note and a Route with the Note objId
	@param {!number} objId the objId of the note to search
	@return (NoteAndRoute) a NoteAndRoute object with the route and note
	*/

	getNoteAndRoute ( noteObjId ) {
		let note = null;
		let route = null;
		note = theTravelNotesData.travel.notes.getAt ( noteObjId );
		if ( ! note ) {
			let routeIterator = theTravelNotesData.travel.routes.iterator;
			while ( ! ( routeIterator.done || note ) ) {
				note = routeIterator.value.notes.getAt ( noteObjId );
				if ( note ) {
					route = routeIterator.value;
				}
			}
			if ( ! note ) {
				note = theTravelNotesData.travel.editedRoute.notes.getAt ( noteObjId );
				if ( note ) {
					route = theTravelNotesData.travel.editedRoute;
				}
			}
		}
		return Object.freeze ( { note : note, route : route } );
	}

	/**
	Search a WayPoint with the WayPoint objId
	@param {!number} objId the objId of the note to search
	@return (NoteAndRoute) a NoteAndRoute object with the route and note
	*/

	getWayPoint ( wayPointObjId ) {
		let wayPoint = theTravelNotesData.travel.editedRoute.wayPoints.getAt ( wayPointObjId );
		if ( ! wayPoint ) {
			let routeIterator = theTravelNotesData.travel.routes.iterator;
			while ( ! ( routeIterator.done || wayPoint ) ) {
				wayPoint = routeIterator.value.wayPoints.getAt ( wayPointObjId );
			}
		}
		return wayPoint;
	}
}

const OUR_DATA_SEARCH_ENGINE = new DataSearchEngine ( );

export {

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@desc The one and only one instance of DataSearchEngine class
	@type {DataSearchEngine}
	@constant
	@global

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	OUR_DATA_SEARCH_ENGINE as theDataSearchEngine
};

/*
--- End of DataSearchEngine.js file -------------------------------------------------------------------------------------------
*/