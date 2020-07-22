/*
Copyright - 2017 - wwwouaiebe - Contact: http//www.ouaie.be/
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
--- WayPoint.js file --------------------------------------------------------------------------------------------------
This file contains:
	- the newWayPoint function
Changes:
	- v1.0.0:
		- created
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
	- v1.12.0:
		- Issue #120 : Review the UserInterface
Doc reviewed 20191122
Tests ...

-----------------------------------------------------------------------------------------------------------------------
*/

import { newObjId } from '../data/ObjId.js';
import { newObjType } from '../data/ObjType.js';
import { newUtilities } from '../util/Utilities.js';
import { LAT_LNG, ZERO, ONE } from '../util/Constants.js';

const ourObjType = newObjType ( 'WayPoint' );

/*
--- newWayPoint function ------------------------------------------------------------------------------------------

Patterns : Closure

-----------------------------------------------------------------------------------------------------------------------
*/

function newWayPoint ( ) {

	let myName = '';

	let myAddress = '';

	let myLat = LAT_LNG.defaultValue;

	let myLng = LAT_LNG.defaultValue;

	let myObjId = newObjId ( );

	/*
	--- myGetFullName function ----------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myGetFullName ( ) {
		let fullName = ( '' === myName ? myAddress : myName + ', ' + myAddress );
		if ( '' === fullName ) {
			fullName = newUtilities ( ).formatLatLng ( [ myLat, myLng ] );
		}

		return fullName;
	}

	/*
	--- myValidate function -------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myValidate ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
			throw new Error ( 'No objType for ' + ourObjType.name );
		}
		ourObjType.validate ( something.objType );
		if ( ourObjType.version !== something.objType.version ) {
			switch ( something.objType.version ) {
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
				something.address = something.name;
				something.name = '';
				something.objType.version = '1.12.0';
				break;
			default :
				throw new Error ( 'invalid version for ' + ourObjType.name );
			}
		}
		let properties = Object.getOwnPropertyNames ( something );
		[ 'address', 'name', 'lat', 'lng', 'objId' ].forEach (
			property => {
				if ( ! properties.includes ( property ) ) {
					throw new Error ( 'No ' + property + ' for ' + ourObjType.name );
				}
			}
		);
		return something;
	}

	/*
	--- myGetObject function ------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myGetObject ( ) {
		return {
			name : myName,
			address : myAddress,
			lat : parseFloat ( myLat.toFixed ( LAT_LNG.fixed ) ),
			lng : parseFloat ( myLng.toFixed ( LAT_LNG.fixed ) ),
			objId : myObjId,
			objType : ourObjType.object
		};
	}

	/*
	--- mySetObject function ------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function mySetObject ( something ) {
		let otherthing = myValidate ( something );
		myAddress = otherthing.address || '';
		myName = otherthing.name || '';
		myLat = otherthing.lat || LAT_LNG.defaultValue;
		myLng = otherthing.lng || LAT_LNG.defaultValue;
		myObjId = newObjId ( );
	}

	/*
	--- wayPoint object -----------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	return Object.seal (
		{

			get address ( ) { return myAddress; },
			set address ( Address ) { myAddress = Address; },

			get name ( ) { return myName; },
			set name ( Name ) { myName = Name; },

			get fullName ( ) { return myGetFullName ( ); },

			get lat ( ) { return myLat; },
			set lat ( Lat ) { myLat = Lat; },

			get lng ( ) { return myLng; },
			set lng ( Lng ) { myLng = Lng; },

			get latLng ( ) { return [ myLat, myLng ]; },
			set latLng ( LatLng ) {
				myLat = LatLng [ ZERO ];
				myLng = LatLng [ ONE ];
			},

			get objId ( ) { return myObjId; },

			get objType ( ) { return ourObjType; },

			get object ( ) { return myGetObject ( ); },
			set object ( something ) { mySetObject ( something ); }
		}
	);
}

export { newWayPoint };

/*
--- End of WayPoint.js file -------------------------------------------------------------------------------------------
*/