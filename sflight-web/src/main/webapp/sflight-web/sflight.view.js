sap.ui.jsview("sflight-web.sflight", {

		oMainHeader : null,
		oDepartureCombo : null,
		oArrivalCombo : null,
		oFlightListPanel : null,
		oMsgViewHLayout : null,
		oMsgField : null,
		oMsgIcon : null,
		oFlightsTable : null,
		oFlightDetailsForm : null,
		oFlightDetailsPanel : null,
		oFlightListPanel : null,

		/**
		 * Specifies the Controller belonging to this View. In the
		 * case that it is not implemented, or that "null" is
		 * returned, this View does not have a Controller.
		 * 
		 * @memberOf sflight-web.sflight
		 */
		getControllerName : function() {
			return "sflight-web.sflight";
		},
		

		/**
		 * Is initially called once after the Controller has been
		 * instantiated. It is the place where the UI is
		 * constructed. Since the Controller is given to this
		 * method, its event handlers can be attached right away.
		 * 
		 * @memberOf sflight-web.sflight
		 */
		createContent : function(oController) {
			this.createMainHeader(oController);
			this.createFlightSearchPanel(oController);			
			this.createFlightListPanel(oController);			
			this.createFlightDetailsPanel(oController);

			// main layout 
			var oMainLayout = new sap.ui.commons.layout.VerticalLayout({
				content : [ this.oMainHeader, this.oFlightSearchPanel, this.oFlightListPanel, this.oFlightDetailsPanel ]
			}).addStyleClass("margin-8px");

			return oMainLayout;
		},

		getFlightTable : function() {
			return this.oFlightsTable;
		},
		
		getFlightDetailsForm : function() {
			return this.oFlightDetailsForm; 
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

		/**
		 * Creates this.oFlightListPanel.
		 * @param oController
		 */
		createFlightListPanel : function(oController) {
			var that = this; 
			this.oFlightsTable = new sap.ui.table.Table({
				visibleRowCount : 7,
				selectionMode : sap.ui.table.SelectionMode.Single,
				rowSelectionChange : function(oEvent) {
					var index = that.oFlightsTable.getSelectedIndex();
					if (index > -1) {
						var row = that.oFlightsTable.getRows()[index];
						var cells = row.getCells();
						oController.getFlightDetails(cells[0].getText(), cells[1].getText(), cells[2].getText());
						that.oFlightDetailsPanel.setVisible(true);
					}
				},
				selectionBehavior : sap.ui.table.SelectionBehavior.Row
			});

			// define the columns and the control templates to be
			// used
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "Carrier ID"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "CARRID"),
				sortProperty : "CARRID",
				filterProperty : "CARRID",
				width : "20%"
			}));
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "Connection ID"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "CONNID"),
				sortProperty : "CONNID",
				filterProperty : "CONNID",
				width : "20%"
			}));
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "Flight Date"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "FLDATE"),
				sortProperty : "FLDATE",
				filterProperty : "FLDATE",
				width : "20%"
			}));
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "Departure Time"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "DEPTIME"),
				sortProperty : "DEPTIME",
				filterProperty : "DEPTIME",
				width : "20%"
			}));
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "Maximum No Seats"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "SEATSMAX"),
				sortProperty : "SEATSMAX",
				filterProperty : "SEATSMAX",
				width : "20%"
			}));
			this.oFlightsTable.addColumn(new sap.ui.table.Column({
				label : new sap.ui.commons.Label({
					text : "No Seats Occupied"
				}),
				template : new sap.ui.commons.TextView().bindProperty("text", "SEATSOCC"),
				sortProperty : "SEATSOCC",
				filterProperty : "SEATSOCC",
				width : "20%"
			}));

			// -------------------------
			// Flight list panel
			// -------------------------
			this.oFlightListPanel = new sap.ui.commons.Panel({
				title : new sap.ui.core.Title({
					text : "List of Available Flights"
				})
			}).addStyleClass("padding-top-10px");
			this.oFlightListPanel.addContent(this.oFlightsTable);
		},

		/**
		 * Creates this.oFlightSearchPanel.
		 * @param oController
		 */
		createFlightSearchPanel : function(oController) {
			var that = this;
			
			// departure ComboBox
			var oDepartureLabel = new sap.ui.commons.Label({
				text : 'Departure'
			}).addStyleClass("padding-3px-5px-3px-19px");
			this.oDepartureCombo = new sap.ui.commons.ComboBox("departureCB", {
				change : function(oEvent) {
					var oSearchBtn = sap.ui.getCore().getControl("searchBtn");
					var oArrivalCombo = sap.ui.getCore().getControl("arrivalCB");

					if (oArrivalCombo.getSelectedKey() && this.getSelectedKey()) {
						oSearchBtn.setEnabled(true);
					}
				}
			});
			oDepartureLabel.setLabelFor(this.oDepartureCombo);

			// oDepartureComboBox data binding
			var oSorter = new sap.ui.model.Sorter("cty", false, true);
			this.oDepartureCombo.bindItems("/data", new sap.ui.core.ListItem({
				key : "{cty}",
				text : "{cty}"
			}), oSorter, null);

			var oDepartureHLayout = new sap.ui.commons.layout.HorizontalLayout({
				content : [ oDepartureLabel, this.oDepartureCombo ]
			});

			// arrival combo
			var oArrivalLabel = new sap.ui.commons.Label({
				text : 'Arrival'
			}).addStyleClass("padding-3px-5px-3px-19px");
			this.oArrivalCombo = new sap.ui.commons.ComboBox("arrivalCB", {
				change : function(oEvent) {
					var oSearchBtn = sap.ui.getCore().getControl("searchBtn");
					var oDepartureCombo = sap.ui.getCore().getControl("departureCB");

					if (oDepartureCombo.getSelectedKey() && this.getSelectedKey()) {
						oSearchBtn.setEnabled(true);
					}
				}
			});
			oArrivalLabel.setLabelFor(this.oArrivalCombo);

			// oArrivalComboBox data binding
			this.oArrivalCombo.bindItems("/data", new sap.ui.core.ListItem({
				key : "{cty}",
				text : "{cty}"
			}), oSorter, null);

			var oArrivalHLayout = new sap.ui.commons.layout.HorizontalLayout({
				content : [ oArrivalLabel, this.oArrivalCombo ]
			}).addStyleClass("padding-right-20px");

			// Search flight button
			var oSearchBtn = new sap.ui.commons.Button("searchBtn", {
				text : "Search",
				width : '70px',
				tooltip : "Search for flights between the selected cities",
				style : sap.ui.commons.ButtonStyle.Default,
				press : function() {
					var cityFrom = that.oDepartureCombo.getSelectedKey();
					var cityTo = that.oArrivalCombo.getSelectedKey();
					oController.searchFlights(cityFrom, cityTo, true);
				},
				enabled : false
			});

			// messages area (only visible if a message is
			// displayed)
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
				content : [ this.oMsgIcon.addStyleClass("padding-0px-5px-5px-0px"), this.oMsgField,
						new sap.ui.commons.Button({
							text : "Close Message",
							tooltip : "Close the displayed message",
							style : sap.ui.commons.ButtonStyle.Default,
							press : function() {
								oController.hideMsgArea();
							}
						}).addStyleClass("margin-left-5px") ]
			}).addStyleClass("padding-top-10px");

			var oFlightPanelVLayout = new sap.ui.commons.layout.VerticalLayout({ 
				content : [ new sap.ui.commons.layout.HorizontalLayout({
					content : [ oDepartureHLayout, oArrivalHLayout, oSearchBtn ]
				}).addStyleClass("padding-top-10px"), that.oMsgViewHLayout, ]
			});

			// -------------------------
			// Flight search panel
			// -------------------------
			this.oFlightSearchPanel = new sap.ui.commons.Panel({
				title : new sap.ui.core.Title({
					text : "Search For Flights"
				})
			}).addStyleClass("padding-top-10px");

			this.oFlightSearchPanel.addContent(oFlightPanelVLayout);
		},		
		
		/**
		 * Creates this.oFlightDetailsPanel.
		 * @param oController
		 */
		createFlightDetailsPanel : function(oController) {
			var that = this; 
			this.oFlightDetailsForm = new sap.ui.layout.form.SimpleForm("sf1", {
				maxContainerCols : 3, 
				content : [
						new sap.ui.core.Title({
							text : "Flight Information"
						}),
						new sap.ui.commons.Label({
							text : "Carrier ID"
						}),
						new sap.ui.commons.TextView("carrid", {
							text : "{/CARRID}"
						}),

						new sap.ui.commons.Label({
							text : "Connection ID"
						}),
						new sap.ui.commons.TextView("connid", {
							text : "{/CONNID}"
						}),

						new sap.ui.commons.Label({
							text : "Plane type"
						}),
						new sap.ui.commons.TextView({
							text : "{/PLANETYPE}"
						}),

						new sap.ui.commons.Label({
							text : "Departure"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/CITYFROM}"
							}), new sap.ui.commons.TextView({
								text : ","
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/AIRPFROM}"
							}), new sap.ui.commons.TextView({
								text : ","
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/COUNTRYFR}"
							}) ]
						}),
						new sap.ui.commons.Label({
							text : "Arrival"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/CITYTO}"
							}), new sap.ui.commons.TextView({
								text : ","
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/AIRPTO}"
							}), new sap.ui.commons.TextView({
								text : ","
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/COUNTRYTO}"
							}) ]
						}),

						new sap.ui.commons.Label({
							text : "Distance"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/DISTANCE}"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/DISTID}"
							}), ]
						}),

						new sap.ui.core.Title({
							text : "Booking Details"
						}),
						new sap.ui.commons.Label({
							text : "Flight date"
						}),
						new sap.ui.commons.TextView("fldate", {
							text : "{/FLDATE}"
						}),

						new sap.ui.commons.Label({
							text : "Flight duration"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/FLTIME}"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "min"
							}), ]
						}),

						new sap.ui.commons.Label({
							text : "Departure time"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/DEPTIME}"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "min"
							}), ]
						}),

						new sap.ui.commons.Label({
							text : "Arrival time"
						}),
						new sap.ui.commons.TextView({
							text : "{/ARRTIME}"
						}),

						new sap.ui.commons.Label({
							text : "Seats"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "Total:"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/SEATSMAX}"
							}), new sap.ui.commons.TextView({
								text : ", Occupied:"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/SEATSOCC}"
							}), ]
						}),

						new sap.ui.commons.Label({
							text : "Price"
						}),
						new sap.ui.commons.layout.HorizontalLayout({
							content : [ new sap.ui.commons.TextView({
								text : "{/PRICE}"
							}), new sap.ui.commons.TextView({
								width : "3px"
							}), new sap.ui.commons.TextView({
								text : "{/CURRENCY}"
							}), ]
						}),

						new sap.ui.core.Title({
							text : "Book Now"
						}),
						new sap.ui.commons.Button({
							text : "Book Flight",
							tooltip : "Book selected flight now",
							style : sap.ui.commons.ButtonStyle.Default,
							width : "80px",
							press : function() {
								var index = that.oFlightsTable.getSelectedIndex();
								if (index > -1) { 
									var row = that.oFlightsTable.getRows()[index];
									var cells = row.getCells();
									oController.bookFlight(cells[0].getText(), cells[1].getText(), cells[2]
											.getText());
									var cityFrom = that.oDepartureCombo.getSelectedKey();
									var cityTo = that.oArrivalCombo.getSelectedKey();
									oController.searchFlights(cityFrom, cityTo, false);									
									that.oFlightDetailsPanel.setVisible(false);
								}
							}
						}) ]
			});

			this.oFlightDetailsPanel = new sap.ui.commons.Panel({
				title : new sap.ui.core.Title({
					text : "Booking Information"
				}),
				visible : false
			});
			this.oFlightDetailsPanel.addContent(this.oFlightDetailsForm);						
		},
		
		/**
		 * Creates this.oMainHeader.
		 * @param oController
		 */
		createMainHeader : function(oController) {
			this.oMainHeader = new sap.ui.commons.layout.VerticalLayout(
					{
						content : [
								new sap.ui.commons.layout.HorizontalLayout({
									content : [ new sap.ui.commons.Image({
										src : "images/SAPLogo.gif",
										height : "16px",
										width : "32px"
									}).addStyleClass("padding-0px-5px-5px-0px"),
											new sap.ui.commons.TextView({
												text : "HANA Cloud Development Example",
												design : sap.ui.commons.TextViewDesign.H3
											}) ]
								}),
								new sap.ui.commons.layout.HorizontalLayout(
										{
											content : [
													new sap.ui.commons.TextView(
															{
																text : "Example shows how to use the JCo API in a Web Application to work with the ",
																design : sap.ui.commons.TextViewDesign.Standard
															}),
													new sap.ui.commons.Link({
														text : "SFlight Model of an ABAP system.",
														href : oController.getFlightServiceURL()
																+ "/flights/Frankfurt/New%20York",
														target : "_blank"
													}).addStyleClass("margin-left-and-right-3px") ]
										}),
								new sap.ui.commons.layout.HorizontalLayout(
										{
											content : [ new sap.ui.commons.TextView(
													{
														text : "All data is fetched from or sent to an on-premise ABAP system using the SAP HANA Cloud Connector.",
														design : sap.ui.commons.TextViewDesign.Standard
													}) ],
										}) ]
					}).addStyleClass("padding-5px-0px-10px-2px");						
		}, 
});
