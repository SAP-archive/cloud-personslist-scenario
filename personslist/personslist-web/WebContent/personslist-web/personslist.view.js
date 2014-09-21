sap.ui.jsview("personslist-web.personslist", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf personslist-web.personslist
	*/ 
	getControllerName : function() {
		return "personslist-web.personslist";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf personslist-web.personslist
	*/ 
	createContent : function(oController) {
		// create the button instance
		var myButton = new sap.ui.commons.Button("btn");

		// set properties, e.g. the text (there is also a shorter way of setting several properties)
		myButton.setText("Hello World!");

		// attach an action to the button's "press" event (use jQuery to fade out the button)
		myButton.attachPress(function(){$("#btn").fadeOut();});

		return myButton;
	}

});