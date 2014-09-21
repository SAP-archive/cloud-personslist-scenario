sap.ui.controller("sflight-web.sflight",
		{

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created. Can be
			 * used to modify the View before it is displayed, to bind event handlers and do other one-time
			 * initialization.
			 * 
			 * @memberOf sflight-web.sflight
			 */
			onInit : function() {
				var oJsonModel = new sap.ui.model.json.JSONModel(this.getFlightServiceURL() + "/cities");
				this.getView().setModel(oJsonModel);	
			},
			
			/**
			 * Returns the flight service root URL.
			 */
			getFlightServiceURL : function() {
				var sOrigin = window.location.protocol + "//" + window.location.hostname
						+ (window.location.port ? ":" + window.location.port : "");
				return sOrigin + "/sflight-web/rest/v1/flight.svc";
			},

			/**
			 * Search flights. 	
			 */
			searchFlights : function(cityFrom, cityTo, showMessage) {
				var oJsonModel = new sap.ui.model.json.JSONModel(null);
				oJsonModel.loadData(this.getFlightServiceURL() + "/flights/" + cityFrom + "/" + cityTo, null, false);
				var oTable = this.getView().getFlightTable();
				oTable.setModel(oJsonModel);							
				oTable.bindRows("/data");	
				oTable.sort(oTable.getColumns()[0]);					
				if (showMessage) {						
					if (oJsonModel.oData.data) {
						this.showMsgArea("info", oJsonModel.oData.data.length + " flights from " + cityFrom + " to " + cityTo + " loaded.");
					} else {
						this.showMsgArea("info", "No flights available from " + cityFrom + " to " + cityTo + ".");
					}
				}
			},
			
			/**
			 * Read flight details. 	
			 */
			getFlightDetails : function(carrId, connId, date) {
				var oJsonModel = new sap.ui.model.json.JSONModel(this.getFlightServiceURL() + "/flight/" + carrId + "/" + connId + "/" + date);
				var oFlightDetailsForm = this.getView().getFlightDetailsForm();
				oFlightDetailsForm.setModel(oJsonModel);			
			},

			/** 
			 * Book a flight.
			 */
			bookFlight : function(carrId, connId, date) {				
				var params = "carrier=" + carrId + "&connNumber=" + connId + "&dateOfFlight=" + date;				
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("post", this.getFlightServiceURL() + "/booking", false);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			    xmlhttp.setRequestHeader('X_REQUESTED_WITH','XMLHttpRequest');   
			    xmlhttp.send(params);
			    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			    	var jsonResponse = xmlhttp.responseText;			    	
			    	var bookId = jsonResponse.substring(11, jsonResponse.length-2); 			    	
				    if (bookId!="00000000") {
				    	this.showMsgArea("info", "Flight " + carrId + "/" + connId + " at " + date + " has been booked successfully, booking id is " + bookId + ".");
				    } else {
				    	this.showMsgArea("info", "No seats available for flight " + carrId + "/" + connId + " at " + date + ". Please book another flight.");
				    }
			    } else {
			    	this.showMsgArea("info", "Booking failed. Please try again with a new booking attempt.");
			    }

			}, 
				
			/** 
			 * Show message area. 
			 */
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
			}

		});