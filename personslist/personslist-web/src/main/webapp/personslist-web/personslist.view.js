sap.ui.jsview("personslist-web.personslist", {

	oFirstNameField : null,
	oLastNameField : null,
	oCountriesDropDown : null,
	oCrudPanel : null,
	oMsgViewHLayout : null,
	oMsgField : null,
	oMsgIcon : null,
	

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
		var that = this;
		// -----------------------
		//   PERSONS TABLE panel
		// -----------------------
		var oPersonsTable = new sap.ui.table.Table({
			visibleRowCount : 7,
			selectionMode : sap.ui.table.SelectionMode.Single,
			rowSelectionChange : function(oEvent) {
				var oRowCtx = oEvent.getParameters().rowContext;
				if(oRowCtx!==null){ // in case of table.clearSelection() it is null
					that.oFirstNameField.bindElement(oRowCtx.getPath());
					that.oLastNameField.bindElement(oRowCtx.getPath());
					that.oCountriesDropDown.bindProperty("selectedKey", oRowCtx.getPath() + "/CountryCode")
				}
			}
		});

		// define the columns and the control templates to be used
		oPersonsTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "First Name"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "FirstName"),
			sortProperty : "FirstName",
			filterProperty : "FirstName",
			width : "20%"
		}));
		oPersonsTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Last Name"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "LastName"),
			sortProperty : "LastName",
			filterProperty : "LastName",
			width : "60%"
		}));
		oPersonsTable.addColumn(new sap.ui.table.Column({
			label : new sap.ui.commons.Label({
				text : "Country"
			}),
			template : new sap.ui.commons.TextView().bindProperty("text", "Country"),
			sortProperty : "Country",
			filterProperty : "Country",
			width : "20%"
		}));

		// bind table rows to /Persons based on the model defined in the init method of the controller
		oPersonsTable.bindRows("/Persons");

		// --------------
		//   CRUD panel
		// --------------
		this.oCrudPanel = new sap.ui.commons.Panel({
			title : new sap.ui.core.Title({
				text : "CRUD OData Service Example"
			})
		}).addStyleClass("padding-top-10px");

		// -----------------
		//   CREATE button
		// -----------------
		var oCreateBtn = new sap.ui.commons.Button({
			text : "Create",
			tooltip : "Create a new person entity with the entered first and last name",
			style : sap.ui.commons.ButtonStyle.Default,
			press : function() {
				oController.createPerson(oPersonsTable);
			}
		});

		// ---------------
		//   READ button
		// ---------------
		var oReadBtn = new sap.ui.commons.Button({
			text : "Read",
			tooltip : "Read persons OData service to retrieve the numbers of stored persons",
			style : sap.ui.commons.ButtonStyle.Default,
			press : function() {
				oController.readPersons();
			}
		});

		// -----------------
		//   UPDATE button
		// -----------------
		var oUpdateBtn = new sap.ui.commons.Button({
			text : "Update",
			tooltip : "Select a row from persons table and change the displayed names. Choose update to store the changed values",
			style : sap.ui.commons.ButtonStyle.Default,
			press : function() {
				oController.updateSelectedPerson(oPersonsTable);
			}
		});

		// -----------------
		//   DELETE button
		// -----------------
		var oDeleteBtn = new sap.ui.commons.Button({
			text : "Delete",
			tooltip : "Delete person entity of the selected table row",
			style : sap.ui.commons.ButtonStyle.Default,
			press : function() {
				oController.deleteSelectedPerson(oPersonsTable);
			}
		});

		this.oCrudPanel.addButton(oCreateBtn);
		this.oCrudPanel.addButton(oReadBtn);
		this.oCrudPanel.addButton(oUpdateBtn);
		this.oCrudPanel.addButton(oDeleteBtn);

		// ----------------------
		//   CRUD panel content
		// ----------------------
		// firstname field
		var oFirstNameLabel = new sap.ui.commons.Label({
			text : 'First Name'
		}).addStyleClass("padding-3px-5px-3px-0px");
		this.oFirstNameField = new sap.ui.commons.TextField({
			value : "{FirstName}"
		});
		oFirstNameLabel.setLabelFor(this.oFirstNameField);

		var oFirstNameHLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ oFirstNameLabel, this.oFirstNameField]
		}).addStyleClass("padding-top-2px");

		// lastname field
		var oLastNameLabel = new sap.ui.commons.Label({
			text : 'Last Name'
		}).addStyleClass("padding-3px-5px-3px-0px");
		this.oLastNameField = new sap.ui.commons.TextField({
			value : "{LastName}"
		});
		oLastNameLabel.setLabelFor(this.oLastNameField);
		var oLastNameHLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ oLastNameLabel,this.oLastNameField]
		}).addStyleClass("padding-top-2px");

		// countries dropdown
		var oCountryLabel = new sap.ui.commons.Label({
			text : 'Country'
		}).addStyleClass("padding-3px-5px-3px-19px");
		this.oCountriesDropDown = new sap.ui.commons.DropdownBox();
		oCountryLabel.setLabelFor(this.oCountriesDropDown);

		var oCountryHLayout = new sap.ui.commons.layout.HorizontalLayout({
			content : [ oCountryLabel, this.oCountriesDropDown]
		}).addStyleClass("padding-top-2px");

		// messages area (only visible if a message is displayed)
		this.oMsgField = new sap.ui.commons.TextView({
			text : ""
		});
		this.oMsgIcon = new sap.ui.commons.Image({
			src : "images/info.png",
			height : "16px",
			width : "16px"
		});
		this.oMsgViewHLayout = new sap.ui.commons.layout.HorizontalLayout({
			visible : false,
			content : [
					this.oMsgIcon.addStyleClass("padding-0px-5px-5px-0px"),
					this.oMsgField.addStyleClass("padding-top-2px"),
					new sap.ui.commons.Button({
						text : "Close Message",
						tooltip : "Close the displayed message",
						style : sap.ui.commons.ButtonStyle.Default,
						press : function() {
							oController.hideMsgArea();
						}
					}).addStyleClass("margin-left-3px")]
		}).addStyleClass("padding-top-10px");

		var oCrudPanelVLayout = new sap.ui.commons.layout.VerticalLayout({
			content : [ oFirstNameHLayout, 
						oLastNameHLayout, 
						oCountryHLayout, 
						this.oMsgViewHLayout, 
						new sap.ui.commons.layout.VerticalLayout({
							content : [ 
								new sap.ui.commons.TextView({
									text : "UI5 table control bound to Persons OData Service",
									design : sap.ui.commons.TextViewDesign.Bold
								}).addStyleClass("padding-top-30px"), 
								oPersonsTable ]
						})]
		});
		this.oCrudPanel.addContent(oCrudPanelVLayout);

		var oMainHeader = 
			new sap.ui.commons.layout.VerticalLayout({
				content : [
				new sap.ui.commons.layout.HorizontalLayout({
					content : [ 
					new sap.ui.commons.Image({
						src : "images/SAPLogo.gif",
						height : "16px",
						width : "32px"
					}).addStyleClass("padding-0px-5px-5px-0px"),
					new sap.ui.commons.TextView({
						text : "HANA Cloud Development Example",
						design : sap.ui.commons.TextViewDesign.H3
					})]
				}),
				new sap.ui.commons.layout.HorizontalLayout({
					content : [ 
					new sap.ui.commons.TextView({
						text : "CRUD Web Application Example using",
						design : sap.ui.commons.TextViewDesign.Standard
					}), 
					new sap.ui.commons.Link({
						text : "Persons OData Serivce",
						href : oController.getPersonsODataServiceURL(),
						target : "_blank"
					}).addStyleClass("margin-left-and-right-3px"),
					new sap.ui.commons.TextView({
						text : "is extended by a Country field.",
						design : sap.ui.commons.TextViewDesign.Standard
					})]
				}),
				new sap.ui.commons.layout.HorizontalLayout({
					content : [ 
					new sap.ui.commons.TextView({
						text : "Available Countries coming from external",
						design : sap.ui.commons.TextViewDesign.Standard
					}), 
					new sap.ui.commons.Link({
						text : "Countries OData Serivce",
						href : "https://odataespmhana.hana.ondemand.com/personslist-repo-web/sampleodata.svc/Countries/",
						target : "_blank"
					}).addStyleClass("margin-left-3px") ],
				})]
			}).addStyleClass("padding-5px-0px-10px-2px");

		var oMainLayout = new sap.ui.commons.layout.VerticalLayout({
			content : [ oMainHeader, this.oCrudPanel ]
		}).addStyleClass("margin-8px");

		return oMainLayout;
	},

	getFirstNameField : function() {
		return this.oFirstNameField;
	},

	getLastNameField : function() {
		return this.oLastNameField;
	},

	getCrudPanel : function() {
		return this.oCrudPanel;
	},

	getMsgViewHLayout : function() {
		return this.oMsgViewHLayout;
	},

	getMsgField : function() {
		return this.oMsgField;
	},

	getMsgIcon : function() {
		return this.oMsgIcon;
	},

	getCountriesDropDownBox : function() {
		return this.oCountriesDropDown;
	}
});
