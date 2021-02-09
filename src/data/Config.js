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
		- added searchPointMarker, previousSearchLimit, nextSearchLimit to config
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
		- Issue #63 : Find a better solution for provider keys upload
		- Issue #75 : Merge Maps and TravelNotes
	- v1.9.0:
		- issue #101 : Add a print command for a route
	- v1.11.0:
		- Issue #110 : Add a command to create a SVG icon from osm for each maneuver
	- v1.12.0:
		- Issue #120 : Review the UserInterface
	- v2.0.0:
		- Issue #136 : Remove html entities from js string
		- Issue #138 : Protect the app - control html entries done by user.
		- Issue #139 : Remove Globals
Doc reviewed 20200731
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file Config.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module Config
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import { theHTMLSanitizer } from '../util/HTMLSanitizer.js';

/* eslint-disable no-magic-numbers */
let ourPrivateConfig = {
	autoLoad : false,
	map :
	{
		center : {
			lat : 50.50923,
			lng : 5.49542
		},
		zoom : 12
	},
	travelNotesToolbarUI :
	{
		contactMail : {
			url : 'https://github.com/wwwouaiebe/leaflet.TravelNotes/issues'
		}
	},
	layersToolbarUI : {
		haveLayersToolbarUI : true,
		toolbarTimeOut : 1500,
		theDevil : {
			addButton : false
		}
	},
	mouseUI : {
		haveMouseUI : true
	},
	errorUI :
	{
		timeOut : 10000,
		helpTimeOut : 30000,
		showError : true,
		showWarning : true,
		showInfo : true,
		showHelp : true
	},
	geoLocation : {
		color : '#ff0000',
		radius : 11,
		zoomToPosition : true,
		zoomFactor : 17,
		options : {
			enableHighAccuracy : false,
			maximumAge : 0,
			timeout : Infinity
		}
	},
	APIKeys : {
		showDialogButton : true,
		saveToSessionStorage : true,
		showAPIKeysInDialog : true,
		dialogHaveUnsecureButtons : true
	},
	contextMenu : {
		timeout : 1500
	},
	routing : {
		auto : true
	},
	language : 'fr',
	itineraryPointMarker : {
		color : '#ff0000',
		weight : 2,
		radius : 7,
		fill : false
	},
	searchPointMarker : {
		color : '#006400',
		weight : 4,
		radius : 20,
		fill : false
	},
	searchPointPolyline : {
		color : '#006400',
		weight : 4,
		radius : 20,
		fill : false
	},
	previousSearchLimit : {
		color : '#006400',
		fill : false,
		weight : 1
	},
	nextSearchLimit : {
		color : '#ff0000',
		fill : false,
		weight : 1
	},
	wayPoint : {
		reverseGeocoding : false
	},
	route : {
		color : '#ff0000',
		width : 3,
		dashArray : 0,
		dashChoices : [
			{
				text : '——————',
				iDashArray : [ 0 ]
			},
			{
				text : '— — — — —',
				iDashArray : [ 4, 2 ]
			},
			{
				text : '—‧—‧—‧—‧—',
				iDashArray : [ 4, 2, 0, 2 ]
			},
			{
				text : '················',
				iDashArray : [ 0, 2 ]
			}
		],
		elev : {
			smooth : true,
			smoothCoefficient : 0.25,
			smoothPoints : 3
		},
		showDragTooltip : 3
	},
	note : {
		osmSearchNoteDialog : false,
		reverseGeocoding : false,
		grip : {
			size : 10,
			opacity : 0,
			moveOpacity : 1
		},
		polyline : {
			color : '#808080',
			weight : 1
		},
		haveBackground : false,
		svgRoadbookDimCoef : 2,
		svgAnleMaxDirection :
		{
			right : 35,
			slightRight : 80,
			continue : 100,
			slightLeft : 145,
			left : 200,
			sharpLeft : 270,
			sharpRight : 340
		},
		svgZoom : 17,
		svgRcnRefDistance : 20,
		svgAngleDistance : 10,
		osmCityAdminLevel : {
			GB : '10',
			DEFAULT : '8'
		},
		svgHamletDistance : 200,
		svgVillageDistance : 400,
		svgCityDistance : 1200,
		svgTownDistance : 1500,
		svgTimeOut : 40,
		maxManeuversNotes : 100
	},
	noteDialog : {
		theDevil : {
			addButton : false,
			noteZoom : 17
		},
		toggleIconDimension : true,
		toggleIconTextArea : false,
		toggleTooltip : false,
		togglePopupContent : false,
		toggleAddress : false,
		toggleLink : false,
		togglePhone : true,
		iconAreaHeight : 2,
		popupAreaHeigth : 8
	},
	itineraryPointZoom : 17,
	routeEditor : {
		displayEditionInHTMLPage : true
	},
	travelEditor : {
		clearAfterSave : true,
		startMinimized : true,
		timeout : 1000,
		startupRouteEdition : true
	},
	haveBeforeUnloadWarning : true,
	overpassApi : {
		url : 'https://lz4.overpass-api.de/api/interpreter'
	},
	nominatim :
	{
		url : 'https://nominatim.openstreetmap.org/',
		language : '*'
	},
	printRouteMap :
	{
		isEnabled : true,
		maxTiles : 240,
		paperWidth : 287,
		paperHeight : 200,
		pageBreak : false,
		printNotes : true,
		borderWidth : 30,
		zoomFactor : 15,
		entryPointMarker : {
			color : '#00ff00',
			weight : 4,
			radius : 10,
			fill : true,
			fillOpacity : 1
		},
		exitPointMarker : {
			color : '#ff0000',
			weight : 4,
			radius : 10,
			fill : true,
			fillOpacity : 1
		}
	},
	itineraryPane :
	{
		showNotes : true,
		showManeuvers : false
	},
	colorDialog : {
		haveSlider : true,
		initialRed : 0
	}
};
/* eslint-enable no-magic-numbers */

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourCopyObjectTo
@desc copy the properties between two objects
@param {Object} source The source object
@param {Object} target The target object
@example
This method:
- search recursively all target properties
- foreach found property, search the same property in source
- copy the property value from source to target if found
- search recursively all sources properties
- foreach found property search the same property in target
- copy the property value from source to target
So:
- if a property is missing in the user config, the property is selected from the default config
- if a property is in the user config but missing in the default config, the property is also added (and reminder
  that the user can have more dashChoices than the default config )
- if a property is changed in the user config, the property is adapted
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/* eslint-disable max-depth */

function ourCopyObjectTo ( source, target ) {
	if ( ( 'object' !== typeof source ) || ( 'object' !== typeof target ) ) {
		return;
	}
	try {

		// iteration on target.
		for ( let property in target ) {
			if ( 'object' === typeof target [ property ] ) {
				ourCopyObjectTo ( source [ property ], target [ property ] );
			}
			else if ( typeof ( source [ property ] ) === typeof ( target [ property ] ) ) {
				if ( 'string' === typeof ( target [ property ] ) ) {
					if ( 'color' === property ) {
						target [ property ] = theHTMLSanitizer.sanitizeToColor ( source [ property ] ) || target [ property ];
					}
					else if ( 'url' === property ) {
						target [ property ] = theHTMLSanitizer.sanitizeToUrl ( source [ property ] ).url;
					}
					else {
						target [ property ] =
								theHTMLSanitizer.sanitizeToJsString ( source [ property ] );
					}
				}
				else {
					target [ property ] = source [ property ] || target [ property ];
				}
			}
		}

		// iteration on source
		for ( let property in source ) {
			if ( 'object' === typeof source [ property ] ) {
				if ( '[object Array]' === Object.prototype.toString.call ( source [ property ] ) ) {
					target [ property ] = target [ property ] || [];
				}
				else {
					target [ property ] = target [ property ] || {};
				}
				ourCopyObjectTo ( source [ property ], target [ property ] );
			}
			else if ( 'string' === typeof ( target.property ) ) {
				target [ property ] =
							theHTMLSanitizer.sanitizeToHtmlString ( source [ property ], [] ).htmlString;
			}
			else {
				target [ property ] = source [ property ];
			}
		}
	}
	catch ( err ) {
		if ( err instanceof Error ) {
			console.error ( err );
		}
	}
}

/* eslint-enable max-depth */

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourFreeze
@desc Freeze an object recursively
@param {Object} object The object to freeze
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

function ourFreeze ( object ) {
	for ( let property in object ) {
		if ( 'object' === typeof object [ property ] ) {
			object [ property ] = ourFreeze ( object [ property ] );
		}
	}

	return Object.freeze ( object );
}

/**
@------------------------------------------------------------------------------------------------------------------------------

@class
@classdesc Class used to store the configuration of the code
@see {@link theConfig} for the one and only one instance of this class
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class Config {
	get autoLoad ( ) { return ourPrivateConfig.autoLoad; }
	get map ( ) { return ourPrivateConfig.map; }
	get travelNotesToolbarUI ( ) { return ourPrivateConfig.travelNotesToolbarUI; }
	get layersToolbarUI ( ) { return ourPrivateConfig.layersToolbarUI; }
	get mouseUI ( ) { return ourPrivateConfig.mouseUI; }
	get errorUI ( ) { return ourPrivateConfig.errorUI; }
	get APIKeys ( ) { return ourPrivateConfig.APIKeys; }
	get contextMenu ( ) { return ourPrivateConfig.contextMenu; }
	get routing ( ) { return ourPrivateConfig.routing; }
	get language ( ) { return ourPrivateConfig.language; }
	get itineraryPointMarker ( ) { return ourPrivateConfig.itineraryPointMarker; }
	get searchPointMarker ( ) { return ourPrivateConfig.searchPointMarker; }
	get searchPointPolyline ( ) { return ourPrivateConfig.searchPointPolyline; }
	get previousSearchLimit ( ) { return ourPrivateConfig.previousSearchLimit; }
	get nextSearchLimit ( ) { return ourPrivateConfig.nextSearchLimit; }
	get wayPoint ( ) { return ourPrivateConfig.wayPoint; }
	get route ( ) { return ourPrivateConfig.route; }
	get note ( ) { return ourPrivateConfig.note; }
	get noteDialog ( ) { return ourPrivateConfig.noteDialog; }
	get itineraryPointZoom ( ) { return ourPrivateConfig.itineraryPointZoom; }
	get routeEditor ( ) { return ourPrivateConfig.routeEditor; }
	get travelEditor ( ) { return ourPrivateConfig.travelEditor; }
	get haveBeforeUnloadWarning ( ) { return ourPrivateConfig.haveBeforeUnloadWarning; }
	get overpassApi ( ) { return ourPrivateConfig.overpassApi; }
	get nominatim ( ) { return ourPrivateConfig.nominatim; }
	get geoLocation ( ) { return ourPrivateConfig.geoLocation; }
	get printRouteMap ( ) { return ourPrivateConfig.printRouteMap; }
	get itineraryPane ( ) { return ourPrivateConfig.itineraryPane; }
	get colorDialog ( ) { return ourPrivateConfig.colorDialog; }

	overload ( source ) {
		ourCopyObjectTo ( source, ourPrivateConfig );
		ourPrivateConfig = ourFreeze ( ourPrivateConfig );
	}

}

let ourConfig = new Config;

export {

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@desc The one and only one instance of Config class
	@type {Config}
	@constant
	@global

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	ourConfig as theConfig
};

/*
--- End of Config.js file -----------------------------------------------------------------------------------------------------
*/