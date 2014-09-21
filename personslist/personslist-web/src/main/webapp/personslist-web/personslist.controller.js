sap.ui.controller("personslist-web.personslist", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf personslist-web.personslist
*/
	onInit : function() {
		var sOrigin = window.location.protocol + "//" + window.location.hostname
				+ (window.location.port ? ":" + window.location.port : "");
		var personsListOdataServiceUrl = sOrigin + "/personslist-repo-web/personslist.svc";

		var odataModel = new sap.ui.model.odata.ODataModel(
				personsListOdataServiceUrl);
		odataModel.setCountSupported(false);
		this.getView().setModel(odataModel);
	},

	addNewPerson : function(sFirstName, sLastName, oTable) {
		var persons = {};

		persons.FirstName = sFirstName;
		persons.LastName = sLastName;

		this.getView().getModel().create("/Persons", persons, null, this.successMsg, this.errorMsg);
	},

	successMsg : function() {
		sap.ui.commons.MessageBox.alert("Person entity has been successfully created");
	},

	errorMsg : function() {
		sap.ui.commons.MessageBox.alert("Error occured when creating person entity");
	},


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf personslist-web.personslist
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf personslist-web.personslist
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf personslist-web.personslist
*/
//	onExit: function() {
//
//	}

});