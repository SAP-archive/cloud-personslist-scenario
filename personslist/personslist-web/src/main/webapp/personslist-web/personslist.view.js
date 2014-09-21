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
  		// Create an instance of the table control
  		var oTable = new sap.ui.table.Table({
  			title : "Persons List",
  			visibleRowCount : 7,
  			firstVisibleRow : 3,
  			selectionMode : sap.ui.table.SelectionMode.Single,
  		});

  		// toolbar
  		var oTableToolbar = new sap.ui.commons.Toolbar();

  		// first name field
  		var oFirstNameLabel = new sap.ui.commons.Label({
  			text : 'First Name'
  		});
  		var oFirstNameField = new sap.ui.commons.TextField({
  			id : 'firstNameFieldId',
  			value : '',
  			width : '10em',
  		});
  		oFirstNameLabel.setLabelFor(oFirstNameField);

  		oTableToolbar.addItem(oFirstNameLabel);
  		oTableToolbar.addItem(oFirstNameField);

  		// last name field
  		var oLastNameLabel = new sap.ui.commons.Label({
  			text : 'Last Name'
  		});
  		var oLastNameField = new sap.ui.commons.TextField({
  			id : 'lastNameFieldId',
  			value : '',
  			width : '10em',
  		});
  		oLastNameLabel.setLabelFor(oLastNameField);

  		oTableToolbar.addItem(oLastNameLabel);
  		oTableToolbar.addItem(oLastNameField);

  		// add button
  		var oAddPersonButton = new sap.ui.commons.Button({
  			id : 'addPersonButtonId',
  			text : "Add Person",
  			press : function() {
  				oController.addNewPerson(sap.ui.getCore().getControl(
  						"firstNameFieldId").getValue(), sap.ui.getCore()
  						.getControl("lastNameFieldId").getValue(), oTable);
  			}
  		});
  		oTableToolbar.addItem(oAddPersonButton);

  		oTable.setToolbar(oTableToolbar);

  		// define the columns and the control templates to be used
  		oTable.addColumn(new sap.ui.table.Column({
  			label : new sap.ui.commons.Label({
  				text : "First Name"
  			}),
  			template : new sap.ui.commons.TextField().bindProperty("value",
  					"FirstName"),
  			sortProperty : "FirstName",
  			filterProperty : "FirstName",
  			width : "100px"
  		}));
  		oTable.addColumn(new sap.ui.table.Column({
  			label : new sap.ui.commons.Label({
  				text : "Last Name"
  			}),
  			template : new sap.ui.commons.TextField().bindProperty("value",
  					"LastName"),
  			sortProperty : "LastName",
  			filterProperty : "LastName",
  			width : "200px"
  		}));


 // bind table rows to /Persons based on the model defined in the init method of the controller
  		oTable.bindRows("/Persons");

  		return oTable;
      }


});