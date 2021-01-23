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
	- v1.3.0:
		- added the possibility to have an event listener on the cancel button and escape key in
		the derived dialog boxes
	- v1.6.0:
		- Issue #65 : Time to go to ES6 modules?
		- Issue #66 : Work with promises for dialogs
		- Issue #68 : Review all existing promises.
		- Issue #63 : Find a better solution for provider keys upload
	- v1.11.0:
		- Issue #110 : Add a command to create a SVG icon from osm for each maneuver
		- Issue #113 : When more than one dialog is opened, using thr Esc or Return key close all the dialogs
	- v2.0.0:
		- Issue #134 : Remove node.setAttribute ( 'style', blablabla) in the code
		- Issue #135 : Remove innerHTML from code
		- Issue #138 : Protect the app - control html entries done by user.
Doc reviewed 20200811
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file BaseDialog.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module BaseDialog
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/*

Box model

+- .TravelNotes-BaseDialog-BackgroundDiv ---------------------------------------------------------------------------+
|                                                                                                                   |
| +- .TravelNotes-BaseDialog-Container -------------------------------------------------------------+               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-TopBar ------------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-CancelButton ---+                                                | |               |
| | | |  BaseDialog.cancelButton                 |                                                | |               |
| | | +------------------------------------------+                                                | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-HeaderDiv ---------------------------------------------------------+ |               |
| | |  BaseDialog.title                                                                           | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-ContentDiv --------------------------------------------------------+ |               |
| | |  BaseDialog.content                                                                         | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | |                                                                                             | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-ErrorDiv ----------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| |                                                                                                 |               |
| | +- .TravelNotes-BaseDialog-FooterDiv ---------------------------------------------------------+ |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-SearchWait ----------------------------------------------------+ | |               |
| | | |                                                                                         | | |               |
| | | +-----------------------------------------------------------------------------------------+ | |               |
| | |                                                                                             | |               |
| | | +- .TravelNotes-BaseDialog-Button ---------+                                                | |               |
| | | |  BaseDialog.okButton                     |                                                | |               |
| | | +------------------------------------------+                                                | |               |
| | +---------------------------------------------------------------------------------------------+ |               |
| +-------------------------------------------------------------------------------------------------+               |
|                                                                                                                   |
|                                                                                                                   |
|                                                                                                                   |
+-------------------------------------------------------------------------------------------------------------------+
*/

import { theTranslator } from '../UI/Translator.js';
import { theHTMLElementsFactory } from '../util/HTMLElementsFactory.js';
import { theHTMLSanitizer } from '../util/HTMLSanitizer.js';
import { ZERO, TWO } from '../util/Constants.js';

const DRAG_MARGIN = 20;

/**
@------------------------------------------------------------------------------------------------------------------------------

@function ourNewBaseDialog
@desc constructor for BaseDialog objects
@return {BaseDialog} an instance of BaseDialog object
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/* eslint-disable-next-line max-statements */
function ourNewBaseDialog ( ) {

	let myStartDragX = ZERO;
	let myStartDragY = ZERO;
	let myDialogX = ZERO;
	let myDialogY = ZERO;
	let myScreenWidth = ZERO;
	let myScreenHeight = ZERO;

	let myBackgroundDiv = null;
	let myTopBar = null;
	let myDialogDiv = null;
	let myHeaderDiv = null;
	let myContentDiv = null;
	let myErrorDiv = null;
	let myWaitDiv = null;
	let myFooterDiv = null;
	let myWaitAnimationDiv = null;
	let myWaitAnimationBulletDiv = null;
	let myOkButton = null;
	let myCancelButton = null;

	let myOkButtonListener = null;

	let myKeyboardEventListenerEnabled = true;
	let myOnShow = null;

	let myOnOk = null;
	let myOnCancel = null;

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myOnKeyDown
	@desc Keyboard event listener
	@listens keydown
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myOnKeyDown ( keyBoardEvent ) {
		if ( myKeyboardEventListenerEnabled ) {
			if ( 'Escape' === keyBoardEvent.key || 'Esc' === keyBoardEvent.key ) {
				myCancelButton.click ( );
			}
			else if ( 'Enter' === keyBoardEvent.key ) {
				myOkButton.click ( );
			}
		}
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myOnTopBarDragEnd
	@desc Drag end event listener for the top bar
	@listens dragend
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myOnTopBarDragEnd ( dragEndEvent ) {
		myDialogX += dragEndEvent.screenX - myStartDragX;
		myDialogY += dragEndEvent.screenY - myStartDragY;
		myDialogX = Math.min (
			Math.max ( myDialogX, DRAG_MARGIN ),
			myScreenWidth - myDialogDiv.clientWidth - DRAG_MARGIN
		);
		myDialogY = Math.max ( myDialogY, DRAG_MARGIN );
		let dialogMaxHeight = myScreenHeight - Math.max ( myDialogY, ZERO ) - DRAG_MARGIN;
		myDialogDiv.style.top = String ( myDialogY ) + 'px';
		myDialogDiv.style.left = String ( myDialogX ) + 'px';
		myDialogDiv.style [ 'max-height' ] = String ( dialogMaxHeight ) + 'px';
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myOnTopBarDragStart
	@desc Drag start event listener for the top bar
	@listens dragstart
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myOnTopBarDragStart ( dragStartEvent ) {
		try {
			dragStartEvent.dataTransfer.setData ( 'Text', '1' );
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
		myStartDragX = dragStartEvent.screenX;
		myStartDragY = dragStartEvent.screenY;
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myDeleteDialog
	@desc Remove the dialog from the screen
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myDeleteDialog ( ) {
		document.removeEventListener ( 'keydown', myOnKeyDown, true );
		document.querySelector ( 'body' ).removeChild ( myBackgroundDiv );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myOnCancelButtonClick
	@desc Click event listener for the cancel button
	@listens click
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myOnCancelButtonClick ( ) {
		myDeleteDialog ( );
		myOnCancel ( 'Canceled by user' );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myOnOkButtonClick
	@desc Click event listener for the ok button
	@listens click
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myOnOkButtonClick ( ) {
		let returnValue = null;
		if ( myOkButtonListener ) {
			returnValue = myOkButtonListener ( );
			if ( ! returnValue ) {
				return;
			}
		}
		myOkButton.removeEventListener ( 'click', myOnOkButtonClick, false );
		myDeleteDialog ( );
		myOnOk ( returnValue );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateBackgroundDiv
	@desc This method creates the background covering the entire screen
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateBackgroundDiv ( ) {

		// A new element covering the entire screen is created, with drag and drop event listeners
		myBackgroundDiv = theHTMLElementsFactory.create ( 'div', { className : 'TravelNotes-Background' } );
		myBackgroundDiv.addEventListener ( 'dragover', ( ) => null, false );
		myBackgroundDiv.addEventListener ( 'drop', ( ) => null, false );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateDialogDiv
	@desc This method creates the dialog
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateDialogDiv ( ) {

		// the dialog is created
		myDialogDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Container'
			},
			myBackgroundDiv
		);
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateTopBar
	@desc This method creates the top bar of the dialog
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateTopBar ( ) {
		myTopBar = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-TopBar',
				draggable : true
			},
			myDialogDiv
		);
		myTopBar.addEventListener ( 'dragstart', myOnTopBarDragStart, false );
		myTopBar.addEventListener ( 'dragend', myOnTopBarDragEnd, false );

		myCancelButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '❌',
				className : 'TravelNotes-BaseDialog-CancelButton',
				title : theTranslator.getText ( 'BaseDialog - Cancel' )
			},
			myTopBar
		);
		myCancelButton.addEventListener ( 'click', myOnCancelButtonClick, false );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateHeaderDiv
	@desc This method creates the header of the dialog
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateHeaderDiv ( ) {
		myHeaderDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-HeaderDiv'
			},
			myDialogDiv
		);
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateContentDiv
	@desc This method creates the  dialog content
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateContentDiv ( ) {
		myContentDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ContentDiv'
			},
			myDialogDiv
		);
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateErrorDiv
	@desc This method creates the error div
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateErrorDiv ( ) {
		myErrorDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-ErrorDiv TravelNotes-BaseDialog-Hidden'
			},
			myDialogDiv
		);
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateWaitDiv
	@desc This method creates the wait div
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateWaitDiv ( ) {
		myWaitDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-WaitDiv'
			},
			myDialogDiv
		);
		myWaitAnimationBulletDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-WaitAnimationBullet TravelNotes-BaseDialog-Hidden'
			},
			myWaitAnimationDiv = theHTMLElementsFactory.create (
				'div',
				{
					className : 'TravelNotes-WaitAnimation TravelNotes-BaseDialog-Hidden'
				},
				myWaitDiv
			)
		);
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateFooterDiv
	@desc This method creates the footer of the dialog
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateFooterDiv ( ) {
		myFooterDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-FooterDiv'
			},
			myDialogDiv
		);

		myOkButton = theHTMLElementsFactory.create (
			'div',
			{
				textContent : '🆗',
				className : 'TravelNotes-BaseDialog-Button'
			},
			myFooterDiv
		);
		myOkButton.addEventListener ( 'click', myOnOkButtonClick, false );
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCenterDialog
	@desc This method center the dialog on the screen
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCenterDialog ( ) {
		myDialogX = ( myScreenWidth - myDialogDiv.clientWidth ) / TWO;
		myDialogY = ( myScreenHeight - myDialogDiv.clientHeight ) / TWO;
		myDialogX = Math.min (
			Math.max ( myDialogX, DRAG_MARGIN ),
			myScreenWidth - myDialogDiv.clientWidth - DRAG_MARGIN
		);
		myDialogY = Math.max ( myDialogY, DRAG_MARGIN );
		let dialogMaxHeight = myScreenHeight - Math.max ( myDialogY, ZERO ) - DRAG_MARGIN;
		myDialogDiv.style.top = String ( myDialogY ) + 'px';
		myDialogDiv.style.left = String ( myDialogX ) + 'px';
		myDialogDiv.style [ 'max-height' ] = String ( dialogMaxHeight ) + 'px';
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myShow
	@desc This method show the dialog on the screen. It's called bu the Promise created in the show ( ) method.
	@param {function} onOk The Success handler passed to the Promise
	@param {function} onCancel The Error handler passed to the Promise
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myShow ( onOk, onCancel ) {
		myOnOk = onOk;
		myOnCancel = onCancel;

		document.querySelector ( 'body' ).appendChild ( myBackgroundDiv );
		document.addEventListener ( 'keydown', myOnKeyDown, true );

		myScreenWidth = myBackgroundDiv.clientWidth;
		myScreenHeight = myBackgroundDiv.clientHeight;
		myCenterDialog ( );
		if ( myOnShow ) {
			myOnShow ( );
		}
	}

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function myCreateDialog
	@desc This method creates the dialog. This one is not displayed
	@private

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	function myCreateDialog ( ) {
		myCreateBackgroundDiv ( );
		myCreateDialogDiv ( );
		myCreateTopBar ( );
		myCreateHeaderDiv ( );
		myCreateContentDiv ( );
		myCreateErrorDiv ( );
		myCreateWaitDiv ( );
		myCreateFooterDiv ( );
	}

	myCreateDialog ( );

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@class BaseDialog
	@classdesc This class is the base for all the dialogs
	@see {@link newBaseDialog} for constructor
	@hideconstructor

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	class BaseDialog {

		/**
		A function that is called when the user push on the ok button. If this function return nothing, the dialog
		is not closed. If the function return something, the dialog is closed and the returned value is passed as
		parameter to the Success handler of the Promise created with the show ( ) method.
		*/

		set okButtonListener ( okListener ) { myOkButtonListener = okListener; }

		/**
		a boolean that activate (when true) or deactivate (when false) the myOnKeyDown event listener. This is usefull
		when multiple dialogs are opened to avoid that all dialogs closes when using the Esc or Return keys
		*/

		set keyboardEventListenerEnabled ( isEnabled ) { myKeyboardEventListenerEnabled = isEnabled; }

		/**
		A function that will be executed when the dialog is showed on the screen
		*/

		set onShow ( OnShow ) { myOnShow = OnShow; }

		/**
		The title of the dialog
		*/

		set title ( Title ) { myHeaderDiv.textContent = Title; }

		/**
		The content of the dialog. Read only but remember it's an HTMLElement...
		@readonly
		*/

		get content ( ) { return myContentDiv; }

		/**
		The footer of the dialog. Read only but remember it's an HTMLElement...
		@readonly
		*/

		get footer ( ) { return myFooterDiv; }

		/**
		The ok button of the dialog. Read only but remember it's an HTMLElement...
		@readonly
		*/

		get okButton ( ) { return myOkButton; }

		/**
		The cancel button of the dialog. Read only but remember it's an HTMLElement...
		@readonly
		*/

		get cancelButton ( ) { return myCancelButton; }

		/**
		show an error message at the bottom of the dialog
		@param {string} errorText The message to be displayed
		*/

		showError ( errorText ) {
			myErrorDiv.textContent = '';
			theHTMLSanitizer.sanitizeToHtmlElement ( errorText, myErrorDiv );
			myErrorDiv.classList.remove ( 'TravelNotes-BaseDialog-Hidden' );
		}

		/**
		hide the error message at the bottom of the dialog
		*/

		hideError ( ) {
			myErrorDiv.textContent = '';
			myErrorDiv.classList.add ( 'TravelNotes-BaseDialog-Hidden' );
		}

		/**
		show a wait animation at the bottom of the dialog and hide the ok button
		*/

		showWait ( ) {
			myWaitAnimationBulletDiv.classList.remove ( 'TravelNotes-BaseDialog-Hidden' );
			myWaitAnimationDiv.classList.remove ( 'TravelNotes-BaseDialog-Hidden' );
			myOkButton.classList.add ( 'TravelNotes-BaseDialog-Hidden' );
		}

		/**
		hide the wait animation at the bottom of the dialog and show the ok button
		*/

		hideWait ( ) {
			myWaitAnimationBulletDiv.classList.add ( 'TravelNotes-BaseDialog-Hidden' );
			myWaitAnimationDiv.classList.add ( 'TravelNotes-BaseDialog-Hidden' );
			myOkButton.classList.remove ( 'TravelNotes-BaseDialog-Hidden' );
		}

		/**
		show the dialog on the screen
		@return {Promise} a Promise that is fulfilled when the user close the dialog with the ok button or the return key
		or rejected when the cancel button or Esc key is used
		*/

		show ( ) {
			return new Promise ( myShow );
		}
	}

	return Object.seal ( new BaseDialog );
}

export {

	/**
	@--------------------------------------------------------------------------------------------------------------------------

	@function newBaseDialog
	@desc constructor for BaseDialog objects
	@return {BaseDialog} an instance of BaseDialog object
	@global

	@--------------------------------------------------------------------------------------------------------------------------
	*/

	ourNewBaseDialog as newBaseDialog
};

/*
--- End of BaseDialog.js file -------------------------------------------------------------------------------------------------
*/