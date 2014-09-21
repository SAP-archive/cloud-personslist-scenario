sap.ui.controller("personslist-web.personslist",
		{

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created. Can be
			 * used to modify the View before it is displayed, to bind event handlers and do other one-time
			 * initialization.
			 * 
			 * @memberOf personslist-web.personslist
			 */
			onInit : function() {
				// retrieve available countries from external odata defined in webapp/destinations/odataservicedest
				var countriesDropDownBox  = this.getView().getCountriesDropDownBox();
				var extodatamodel = sap.ui.getCore().getModel("extodatamodel");
				countriesDropDownBox.setModel(extodatamodel);
				var oSorter = new sap.ui.model.Sorter("Name", false, true);
				countriesDropDownBox.bindItems("extodatamodel>/Countries", new sap.ui.core.ListItem({
					key : "{extodatamodel>Code}",
					text : "{extodatamodel>Name}"}), oSorter, null );
				countriesDropDownBox.setSelectedKey("DE");
				
				var odataModel = new sap.ui.model.odata.ODataModel(this.getPersonsODataServiceURL());
				odataModel.setCountSupported(false);
				this.getView().setModel(odataModel);
			},

			getPersonsODataServiceURL : function() {
				var sOrigin = window.location.protocol + "//" + window.location.hostname
						+ (window.location.port ? ":" + window.location.port : "");
				return sOrigin + "/personslist-repo-web/personslist.svc";
			},

			// ----------
			// CREATE
			// ----------
			createPerson : function(oTable) {
				var createFirstName = this.getView().getFirstNameField().getValue();
				var createLastName = this.getView().getLastNameField().getValue();

				// empty field check
				if (createFirstName === "" || createLastName === "") {
					this.showMsgArea("warning",
							"Enter non-empty 'First Name' and 'Last Name' values before you create a person.");
				} else {
					var countryDropDownBox = this.getView().getCountriesDropDownBox();
					var countryCode = countryDropDownBox.getSelectedKey();
					var countryName = countryDropDownBox.getValue();
					var persons = {};
					persons.FirstName = createFirstName;
					persons.LastName = createLastName;
					persons.CountryCode = countryCode;
					persons.Country = countryName;

					oTable.clearSelection();

					this.getView().getModel().create("/Persons", persons, null, jQuery.proxy(function(oData) {
						this.showMsgArea("success", "Person entity has been successfully created");
					}, this), jQuery.proxy(function(oData) {
						this.showMsgArea("error", "Error occured while creating person entity");
					}, this));
					// clear fields
					this.getView().getFirstNameField().unbindElement().setValue("");
					this.getView().getLastNameField().unbindElement().setValue("");
				}
			},

			// ----------
			// READ
			// ----------
			readPersons : function() {
				this.getView().getModel().read("/Persons", null, null, true, jQuery.proxy(function(oData) {
					this.showMsgArea("info", oData.results.length + " person(s) currently stored");
				}, this), jQuery.proxy(function(oData) {
					this.showMsgArea("error", "Error occured while creating person entity");
				}, this));
			},

			// ----------
			// UPDATE
			// ----------
			updateSelectedPerson : function(oTable) {
				var oModel = this.getView().getModel();

				// empty table check
				if (Object.keys(oModel.oData).length < 1) {
					this.showMsgArea("warning",
							"Table is empty. Create a person table entry before you update a person.");
				} else {
					var selectedIndex = oTable.getSelectedIndex();
					// selected table row
					if (selectedIndex === -1) {
						this.showMsgArea("warning", "Select the table row of the person you want to update.");
					} else {
						var oSelectedRowCtx = oTable.getContextByIndex(selectedIndex);
						var oModifData = oModel.getProperty("", oSelectedRowCtx, false);
						var updateFirstName = this.getView().getFirstNameField().getValue();
						var updateLastName = this.getView().getLastNameField().getValue();

						// empty field check
						if (updateFirstName === "" || updateLastName === "") {
							this.showMsgArea("warning",
									"Enter non-empty 'First Name' and 'Last Name' values to update a person values.");
						} else {
							var countryDropDownBox = this.getView().getCountriesDropDownBox();
							var countryCode = countryDropDownBox.getSelectedKey();
							var countryName = countryDropDownBox.getValue();
							oModifData.FirstName = updateFirstName;
							oModifData.LastName = updateLastName;
							oModifData.CountryCode = countryCode;
							oModifData.Country = countryName;
							oModel.update(oSelectedRowCtx.getPath(), oModifData, null, jQuery.proxy(function(oData) {
								this.showMsgArea("success", "Person entity has been successfully updated");
							}, this), jQuery.proxy(function(oData) {
								this.showMsgArea("error", "Error occured while updating person entity");
							}, this), true);
						}
					}
				}
			},

			// ----------
			// DELETE
			// ----------
			deleteSelectedPerson : function(oTable) {
				var oModel = this.getView().getModel();

				// empty table check
				if (Object.keys(oModel.oData).length < 1) {
					this.showMsgArea("warning",
							"Table is empty. Create a person table entry before you delete a person.");
				} else {
					var selectedIndex = oTable.getSelectedIndex();
					// selected table row
					if (selectedIndex === -1) {
						this.showMsgArea("warning", "Select the table row of the person you want to delete.");
					} else {
						var oSelectedRowCtx = oTable.getContextByIndex(selectedIndex);
						oTable.clearSelection();
						oModel.remove('', oSelectedRowCtx, jQuery.proxy(function(oData) {
							this.showMsgArea("success", "Person entity has been successfully deleted");
						}, this), jQuery.proxy(function(oData) {
							this.showMsgArea("error", "Error occured while deleting person entity");
						}, this));
						// clear fields
						this.getView().getFirstNameField().unbindElement().setValue("");
						this.getView().getLastNameField().unbindElement().setValue("");
						this.getView().getCountriesDropDownBox().unbindProperty("selectedKey").setSelectedKey("DE");
					}
				}
			},

			// -------------------------
			// message area handling
			// -------------------------
			hideMsgArea : function() {
				this.getView().getMsgField().setText("");
				this.getView().getMsgViewHLayout().setVisible(false);
			},

			showMsgArea : function(iconType, msgText) {
				this.getView().getMsgField().setText(msgText);
				if (iconType === "info" || iconType === "warning" || iconType === "error" || iconType === "success") {
					this.getView().getMsgIcon().setSrc("images/" + iconType + ".png").setVisible(true);
				} else {
					this.getView().getMsgViewHLayout().setVisible(false);
				}
				this.getView().getMsgViewHLayout().setVisible(true);
				this.getView().getCrudPanel().setCollapsed(false);
			}

		});