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
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
	- v1.12.0:
		- Issue #120 : Review the UserInterface
	- v2.0.0:
		- Issue #138 : Protect the app - control html entries done by user.
Doc reviewed 20200728
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file WayPoint.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module WayPoint
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/* eslint no-fallthrough: ["error", { "commentPattern": "eslint break omitted intentionally" }]*/

import { newObjId } from '../data/ObjId.js';
import { newObjType } from '../data/ObjType.js';
import { theUtilities } from '../util/Utilities.js';
import { LAT_LNG, ZERO, ONE } from '../util/Constants.js';
import { theHTMLSanitizer } from '../util/HTMLSanitizer.js';

const OUR_OBJ_TYPE = newObjType ( 'WayPoint' );
const OUR_OBJ_IDS = new WeakMap ( );

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourUpgrade
@desc performs the upgrade
@param {Object} wayPoint a wayPoint to upgrade
@throws {Error} when the wayPoint version is invalid
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

function ourUpgrade ( wayPoint ) {
	switch ( wayPoint.objType.version ) {
	case '1.0.0' :
	case '1.1.0' :
	case '1.2.0' :
	case '1.3.0' :
	case '1.4.0' :
	case '1.5.0' :
	case '1.6.0' :
	case '1.7.0' :
	case '1.7.1' :
	case '1.8.0' :
	case '1.9.0' :
	case '1.10.0' :
	case '1.11.0' :
		wayPoint.address = wayPoint.name;
		wayPoint.name = '';
		// eslint break omitted intentionally
	case '1.12.0' :
	case '1.13.0' :
	case '2.0.0' :
	case '2.1.0' :
		wayPoint.objType.version = '2.2.0';
		break;
	default :
		throw new Error ( 'invalid version for ' + OUR_OBJ_TYPE.name );
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourValidate
@desc verify that the parameter can be transformed to a WayPoint and performs the upgrate if needed
@param {Object} something an object to validate
@return {Object} the validated object
@throws {Error} when the parameter is invalid
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

function ourValidate ( something ) {
	if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
		throw new Error ( 'No objType for ' + OUR_OBJ_TYPE.name );
	}
	OUR_OBJ_TYPE.validate ( something.objType );
	if ( OUR_OBJ_TYPE.version !== something.objType.version ) {
		ourUpgrade ( something );
	}
	let properties = Object.getOwnPropertyNames ( something );
	[ 'address', 'name', 'lat', 'lng', 'objId' ].forEach (
		property => {
			if ( ! properties.includes ( property ) ) {
				throw new Error ( 'No ' + property + ' for ' + OUR_OBJ_TYPE.name );
			}
		}
	);
	return something;
}

/**
@--------------------------------------------------------------------------------------------------------------------------

@class WayPoint
@classdesc This class represent a way point
@see {@link newWayPoint} for constructor
@hideconstructor

@--------------------------------------------------------------------------------------------------------------------------
*/

class WayPoint {

	constructor ( ) {

		/**
		the name of the WayPoint
		@type {string}
		*/

		this.name = '';

		/**
		the address of the WayPoint
		@type {string}
		*/

		this.address = '';

		/**
		the latitude of the WayPoint
		@type {number}
		*/

		this.lat = LAT_LNG.defaultValue;

		/**
		the longitude of the WayPoint
		@type {number}
		*/

		this.lng = LAT_LNG.defaultValue;

		OUR_OBJ_IDS.set ( this, newObjId ( ) );

		Object.seal ( this );
	}

	/**
	the full name of the WayPoint. Full name is created with the name and address or latitude and longitude
	of the WayPoint
	@readonly
	@type {string}
	*/

	get fullName ( ) {
		let fullName = ( '' === this.name ? this.address : this.name + ', ' + this.address );
		if ( '' === fullName ) {
			fullName = theUtilities.formatLatLng ( [ this.lat, this.lng ] );
		}

		return fullName;
	}

	/**
	the latitude and longitude of the WayPoint
	@type {number[]}
	*/

	get latLng ( ) { return [ this.lat, this.lng ]; }
	set latLng ( LatLng ) {
		this.lat = LatLng [ ZERO ];
		this.lng = LatLng [ ONE ];
	}

	/**
	the objId of the WayPoint. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return OUR_OBJ_IDS.get ( this ); }

	/**
	the ObjType of the WayPoint.
	@type {ObjType}
	@readonly
	*/

	get objType ( ) { return OUR_OBJ_TYPE; }

	/**
	An object literal with the WayPoint properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
	*/

	get jsonObject ( ) {
		return {
			name : this.name,
			address : this.address,
			lat : parseFloat ( this.lat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( this.lng.toFixed ( LAT_LNG.fixed ) ),
			objId : OUR_OBJ_IDS.get ( this ),
			objType : OUR_OBJ_TYPE.jsonObject
		};
	}
	set jsonObject ( something ) {
		let otherthing = ourValidate ( something );
		this.address = otherthing.address || '';
		this.name = otherthing.name || '';
		this.lat = otherthing.lat || LAT_LNG.defaultValue;
		this.lng = otherthing.lng || LAT_LNG.defaultValue;
		OUR_OBJ_IDS.set ( this, newObjId ( ) );
		this.validateData ( );
	}

	validateData ( ) {
		if ( 'string' === typeof ( this.address ) ) {
			this.address = theHTMLSanitizer.sanitizeToJsString ( this.address );
		}
		else {
			this.address = '';
		}
		if ( 'string' === typeof ( this.name ) ) {
			this.name = theHTMLSanitizer.sanitizeToJsString ( this.name );
		}
		else {
			this.name = '';
		}
		if ( 'number' !== typeof ( this.lat ) ) {
			this.lat = LAT_LNG.defaultValue;
		}
		if ( 'number' !== typeof ( this.lng ) ) {
			this.lng = LAT_LNG.defaultValue;
		}
	}
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourNewWayPoint
@desc Constructor for a WayPoint object
@return {WayPoint} an instance of a WayPoint object
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

function ourNewWayPoint ( ) {
	return new WayPoint ( );
}

export {

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function newWayPoint
	@desc Construct a WayPoint object
	@return {WayPoint} an instance of a WayPoint object
	@global

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	ourNewWayPoint as newWayPoint
};

/*
--- End of WayPoint.js file ---------------------------------------------------------------------------------------------------
*/