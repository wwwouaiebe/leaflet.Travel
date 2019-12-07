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
--- Utilities.js file -------------------------------------------------------------------------------------------------
This file contains:
	- the newUtilities function
Changes:
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
Doc reviewed 20191122
Tests ...

-----------------------------------------------------------------------------------------------------------------------
*/

import { theTranslator } from '../UI/Translator.js';

import  { OUR_CONST } from '../util/Constants.js';

function newUtilities ( ) {

	/*
	--- myGetUUID function --------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myGetUUID ( ) {
		function Random4 ( ) {
			return Math
				.floor ( ( OUR_CONST.number1 + Math.random ( ) ) * OUR_CONST.number65536 )
				.toString ( OUR_CONST.hexadecimal )
				.substring ( OUR_CONST.number1 );
		}
		return Random4 ( ) +
			Random4 ( ) + '-' +
			Random4 ( ) + '-' +
			Random4 ( ) + '-' +
			Random4 ( ) + '-' +
			Random4 ( ) +
			Random4 ( ) +
			Random4 ( );
	}

	/* --- End of myGetUUID function --- */

	/*
	--- myStorageAvailable function -----------------------------------------------------------------------------------

	This function test if the storage API is available ( the API can be deactived by user....)
	Adapted from MDN :-)

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myStorageAvailable ( type ) {
		try {
			let storage = window [ type ];
			let	testString = '__storage_test__';
			storage.setItem ( testString, testString );
			storage.removeItem ( testString );
			return true;
		}
		catch ( err ) {
			return false;
		}
	}

	/* --- End of storageAvailable function --- */

	/*
	--- myFileAPIAvailable function -----------------------------------------------------------------------------------

	This function test if the File API is available

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFileAPIAvailable ( ) {
		try {

			// FF...
			new File ( [ 'testdata' ], { type : 'text/plain' } );
			return true;
		}
		catch ( err ) {
			if ( window.navigator.msSaveOrOpenBlob ) {

				// edge IE 11...
				return true;
			}
			return false;
		}
	}

	/* --- End of myFileAPIAvailable function --- */

	/*
	--- mySaveFile function -------------------------------------------------------------------------------------------

	This function save data to a local file

	-------------------------------------------------------------------------------------------------------------------
	*/

	function mySaveFile ( filename, text, type ) {
		if ( ! type ) {
			type = 'text/plain';
		}
		if ( window.navigator.msSaveOrOpenBlob ) {

			// https://msdn.microsoft.com/en-us/library/hh779016(v=vs.85).aspx
			// edge IE 11...
			try {
				window.navigator.msSaveOrOpenBlob ( new Blob ( [ text ] ), filename );
			}
			catch ( err ) {
				console.log ( err ? err : 'An error occurs when saving file' );
			}
		}
		else {

			// FF...
			// http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
			try {
				let mapFile = window.URL.createObjectURL ( new File ( [ text ], { type : type } ) );
				let element = document.createElement ( 'a' );
				element.setAttribute ( 'href', mapFile );
				element.setAttribute ( 'download', filename );
				element.style.display = 'none';
				document.body.appendChild ( element );
				element.click ( );
				document.body.removeChild ( element );
				window.URL.revokeObjectURL ( mapFile );
			}
			catch ( err ) {
				console.log ( err ? err : 'An error occurs when saving file' );
			}
		}
	}

	/* --- End of mySaveFile function --- */

	/*
	--- myFormatTime function -----------------------------------------------------------------------------------------

	This function save data to a local file

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFormatTime ( time ) {
		time = Math.floor ( time );
		if ( 0 === time ) {
			return '';
		}
		let days = Math.floor ( time / OUR_CONST.time.secondInDay );
		let hours = Math.floor ( time % OUR_CONST.time.secondInDay / OUR_CONST.time.secondInHour );
		let minutes = Math.floor ( time % OUR_CONST.time.secondInHour / OUR_CONST.time.secondInMinut );
		let seconds = Math.floor ( time % OUR_CONST.time.secondInMinut );
		if ( 0 < days ) {
			return days +
				'&nbsp;'
				+ theTranslator.getText ( 'Utilities - Day' ) +
				'&nbsp;' +
				hours +
				'&nbsp;' +
				theTranslator.getText ( 'Utilities - Hour' );
		}
		else if ( 0 < hours ) {
			return hours +
				'&nbsp;'
				+ theTranslator.getText ( 'Utilities - Hour' )
				+ '&nbsp;' +
				minutes +
				'&nbsp;'
				+ theTranslator.getText ( 'Utilities - Minute' );
		}
		else if ( 0 < minutes ) {
			return minutes +
				'&nbsp;' +
				theTranslator.getText ( 'Utilities - Minute' );
		}
		return seconds + '&nbsp;' + theTranslator.getText ( 'Utilities - Second' );
	}

	/* --- End of myFormatTime function --- */

	/*
	--- myFormatDistance function -------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFormatDistance ( distance ) {
		distance = Math.floor ( distance );
		if ( 0 === distance ) {
			return '';
		}
		return Math.floor ( distance / OUR_CONST.distance.mInKm ) +
			',' +
			Math.floor ( ( distance % OUR_CONST.distance.mInKm ) / OUR_CONST.distance.round ).toFixed ( 0 )
				.padStart ( OUR_CONST.number2, '0' )
				.padEnd ( OUR_CONST.number3, '0' ) +
			'&nbsp;km';
	}

	/* --- End of myFormatDistance function --- */

	/*
	--- myFormatLat function ------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFormatLat ( lat ) {
		return (
			lat > 0
				?
				lat.toFixed ( OUR_CONST.latLng.fixed ) + '&nbsp;N'
				:
				( -lat ).toFixed ( OUR_CONST.latLng.fixed ) + '&nbsp;S'
		);
	}

	/* --- End of myFormatLat function --- */

	/*
	--- myFormatLng function ------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFormatLng ( lng ) {
		return (
			lng > 0
				?
				lng.toFixed ( OUR_CONST.latLng.fixed ) + '&nbsp;E'
				:
				( -lng ).toFixed ( OUR_CONST.latLng.fixed ) + '&nbsp;W'
		);
	}

	/* --- End of myFormatLng function --- */

	/*
	--- myFormatLatLng function ---------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	function myFormatLatLng ( latLng ) {
		return myFormatLat ( latLng [ 0 ] ) + '&nbsp;-&nbsp;' + myFormatLng ( latLng [ 1 ] );
	}

	/* --- End of myFormatLatLng function --- */

	/*
	--- Utilities object ----------------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	return Object.seal (
		{
			get UUID ( ) { return myGetUUID ( ); },

			storageAvailable : type =>  myStorageAvailable ( type ),

			fileAPIAvailable : ( ) => myFileAPIAvailable ( ),

			saveFile : ( filename, text, type ) => mySaveFile ( filename, text, type ),

			formatTime : time => myFormatTime ( time ),

			formatDistance : distance => myFormatDistance ( distance ),

			formatLat : lat => myFormatLat ( lat ),

			formatLng : lng => myFormatLng ( lng ),

			formatLatLng : latLng => myFormatLatLng ( latLng )
		}
	);
}

export { newUtilities };

/*
--- End of Utilities.js file ------------------------------------------------------------------------------------------
*/