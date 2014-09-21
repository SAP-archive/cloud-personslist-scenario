package com.sap.cloudlabs.connectivity.sflight.jco;

import java.util.HashMap;

import javax.servlet.http.HttpServlet;

import com.sap.cloudlabs.connectivity.sflight.FlightProvider;
import com.sap.conn.jco.JCoContext;
import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;
import com.sap.conn.jco.JCoTable;

/**
 * The class is a <code>FlightProvider</code> implementation that uses JCo for
 * the interaction with the on-premise ABAP system that hosts the SFLIGHT model.
 */
public class JCoFlightProvider extends HttpServlet implements FlightProvider {

	private static final long serialVersionUID = 1L;

	/** destination used by the class to access the ABAP system */
	private static final String SFLIGHT_DESTINATION = "dest_sflight";

	/** name of BAPI in ABAP system to get flight list */
	private static final String BAPI_SFLIGHT_GETLIST = "BAPI_SFLIGHT_GETLIST";

	/** name of BAPI in ABAP system to get flight details */
	private static final String BAPI_SFLIGHT_GETDETAIL = "BAPI_SFLIGHT_GETDETAIL";

	/** name of BAPI in ABAP system to get flight details */
	private static final String BAPI_SBOOK = "BAPI_SBOOK_CREATEFROMDATA";

	/** name of BAPI to start transactional commit */
	private static final String BAPI_TRANSACTION_COMMIT = "BAPI_TRANSACTION_COMMIT";

	/** field for booking ID */
	private static final String FIELD_BOOKID = "BOOKID";

	/** structure with booking data */
	private static final String STRUCT_BOOKINGDATA = "BOOKINGDATA";

	/** structure with input for booking */
	private static final String STRUCT_BOOKINGDATA_IN = "BOOKINGDATA_IN";

	/** mapping between airport cities to countries */
	private static HashMap<String, String> countries;
	static {
		countries = new HashMap<String, String>();
		countries.put("BERLIN", "DE");
		countries.put("FRANKFURT", "DE");
		countries.put("NEW YORK", "US");
		countries.put("ROME", "IT");
		countries.put("SAN FRANCISCO", "US");
		countries.put("SINGAPORE", "SG");
		countries.put("TOKYO", "JP");
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public JCoFlightProvider() {
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.sap.cloudlabs.connectivity.sflight.FlightProvider#getFlightList(java
	 * .lang.String, java.lang.String)
	 */
	public String getFlightList(String cityFrom, String cityTo) {
		try {
			JCoDestination destination = JCoDestinationManager.getDestination(SFLIGHT_DESTINATION);
			JCoFunction bapiSflightGetList = destination.getRepository().getFunction(BAPI_SFLIGHT_GETLIST);

			JCoParameterList imports = bapiSflightGetList.getImportParameterList();
			if (cityFrom != null && !cityFrom.isEmpty()) {
				cityFrom = cityFrom.toUpperCase();
				imports.setValue("FROMCITY", cityFrom);
				imports.setValue("FROMCOUNTRYKEY", countries.get(cityFrom));
			}
			if (cityTo != null && !cityTo.isEmpty()) {
				cityTo = cityTo.toUpperCase();
				imports.setValue("TOCITY", cityTo);
				imports.setValue("TOCOUNTRYKEY", countries.get(cityTo));
			}

			bapiSflightGetList.execute(destination);

			JCoTable flightList = bapiSflightGetList.getTableParameterList().getTable("FLIGHTLIST");
			String result = JCoUtils.tableToJson(flightList);
			return result;
		} catch (JCoException e) {
			throw new RuntimeException(e);
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.sap.cloudlabs.connectivity.sflight.FlightProvider#getFlightDetails
	 * (java.lang.String, java.lang.String, java.lang.String)
	 */
	public String getFlightDetails(String carrier, String connectionNumber, String date) {
		try {
			JCoDestination destination = JCoDestinationManager.getDestination(SFLIGHT_DESTINATION);
			JCoFunction bapiSflightGetDetail = destination.getRepository().getFunction(BAPI_SFLIGHT_GETDETAIL);

			JCoParameterList imports = bapiSflightGetDetail.getImportParameterList();
			if (carrier != null && !carrier.isEmpty()) {
				imports.setValue("AIRLINECARRIER", carrier);
			}
			if (connectionNumber != null && !connectionNumber.isEmpty()) {
				imports.setValue("CONNECTIONNUMBER", connectionNumber);
			}
			if (date != null && !date.isEmpty()) {
				imports.setValue("DATEOFFLIGHT", date);
			}
			bapiSflightGetDetail.execute(destination);

			JCoParameterList exports = bapiSflightGetDetail.getExportParameterList();
			JCoStructure bapiReturn = exports.getStructure("RETURN");
			JCoStructure flightData = exports.getStructure("FLIGHTDATA");

			if (bapiReturn.getChar(0) != 'S') {
				// pw.println("<h2> " + bapiReturn.getString("MESSAGE") +
				// "</h2>");
				throw new IllegalArgumentException("TODO: handle this case");
			} else {
				String result = JCoUtils.recordToJson(flightData);
				return result;
			}
		} catch (JCoException e) {
			throw new RuntimeException(e);
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.sap.cloudlabs.connectivity.sflight.FlightProvider#bookFlight(java
	 * .lang.String, java.lang.String, java.lang.String)
	 */
	public String bookFlight(String carrier, String connectionNumber, String date) {
		try {
			JCoDestination destination = JCoDestinationManager.getDestination(SFLIGHT_DESTINATION);
			JCoFunction bapiBookFlight = destination.getRepository().getFunction(BAPI_SBOOK);

			// customer id, travel agency and flight class are hard-coded in
			// this example
			// to simplify example
			String customid = "1", agencynum = "105", flightclass = "Y";

			JCoStructure bookingData = bapiBookFlight.getImportParameterList().getStructure(STRUCT_BOOKINGDATA_IN);
			if (carrier != null && !carrier.isEmpty()) {
				bookingData.setValue("CARRID", carrier);
			}
			if (connectionNumber != null && !connectionNumber.isEmpty()) {
				bookingData.setValue("CONNID", connectionNumber);
			}
			if (date != null && !date.isEmpty()) {
				bookingData.setValue("FLDATE", date);
			}
			bookingData.setValue("CUSTOMID", customid);
			bookingData.setValue("CLASS", flightclass);
			bookingData.setValue("AGENCYNUM", agencynum);

			JCoContext.begin(destination);
			try {
				bapiBookFlight.execute(destination);
				String bookId = bapiBookFlight.getExportParameterList().getStructure(STRUCT_BOOKINGDATA).getString(FIELD_BOOKID);

				JCoFunction bapiTransactionCommit = destination.getRepository().getFunction(BAPI_TRANSACTION_COMMIT);
				bapiTransactionCommit.execute(destination);

				return bookId;
			} finally {
				JCoContext.end(destination);
			}
		} catch (JCoException e) {
			throw new RuntimeException(e);
		}

	}
}
