package com.sap.cloudlabs.connectivity.sflight;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.springframework.stereotype.Service;

import com.sap.cloudlabs.connectivity.sflight.jco.JCoFlightProvider;

@Service("flightService")
@Path("/flight.svc")
@Produces({ "application/json" })
/**
 * Class <code>FlightService</code> provides the REST service endpoints to provide flight details 
 * and to book flights. The UI of the sample application interacts with those REST endpoints to 
 * access data from the underlying ABAP system. 
 */
public class FlightService {

	// query parameter "fp" specifies which FlightProvider to use, its value is
	// one of FlightProviderEnum
	private final static String QUERY_PARAM_FLIGHT_PROVIDER = "fp";
	
	// list of supported flight providers; right now, only a JCo flight provider is available, later on  this might 
	// be extended to e.g. also offer an odata flight provider
	private enum FlightProviderEnum {
		jco
	};
	
	/** mapping between airport cities to countries; for now, this list is hard coded */
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
	
	@GET
	@Path("/cities")
	@Produces("application/json")
	public String getCityList(@Context HttpServletRequest req) {
		StringBuilder citiesList = new StringBuilder(512);
		Iterator<Entry<String, String>> it = countries.entrySet().iterator();
		citiesList.append("{\"data\":[");
		while (it.hasNext()) {
			Map.Entry<String, String> entry = it.next();
			citiesList.append("{");
			citiesList.append("\"cty\":\"").append(entry.getKey()).append("\",");
			citiesList.append("\"cntry\":\"").append(entry.getValue()).append("\"");
			citiesList.append("},");
		}
		int length = citiesList.length();
		if (length>1) citiesList.setLength(length-1);
		citiesList.append("]}");		
		return citiesList.toString();  
	}

		@GET
		@Path("/flights/{cityFrom}/{cityTo}")
		@Produces("application/json")
		/**
		 * Returns the flight list.
		 * 
		 * @param req The {@link HttpServletRequest} that is processed
		 * @return the flight list as json string
		 */
		public String getFlightList(@Context HttpServletRequest req, @PathParam("cityFrom") String cityFrom,
				@PathParam("cityTo") String cityTo) {
		FlightProvider flightProvider = getFlightProvider(req);
		String flightList = flightProvider.getFlightList(cityFrom, cityTo);
		return flightList;
	}

	@GET
	@Path("/flight/{carrier}/{connNumber}/{dateOfFlight}")
	@Produces("application/json")
	public String getFlightDetails(@Context HttpServletRequest req, @PathParam("carrier") String carrier,
			@PathParam("connNumber") String connNumber, @PathParam("dateOfFlight") String dateOfFlight) {
		FlightProvider flightProvider = getFlightProvider(req);
		String flightDetails = flightProvider.getFlightDetails(carrier, connNumber, dateOfFlight);
		return flightDetails;
	}

	@POST
	@Path("/booking")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("application/json")
	public String createFlighBooking(@Context HttpServletRequest req, @FormParam("carrier") String carrier,
			@FormParam("connNumber") String connNumber, @FormParam("dateOfFlight") String dateOfFlight) {		
		FlightProvider flightProvider = getFlightProvider(req);
		String bookId = flightProvider.bookFlight(carrier, connNumber, dateOfFlight);
		String resultJson = "{\"bookid\":\"" + bookId + "\"}";
		return resultJson;		
	}
	
	/**
	 * Read flight provider type from "fp" query parameter and return related
	 * <code>FlightProvider</code> implementation class. If query parameter is
	 * missing, <code>JCoFlightProvider</code> is returned as default.
	 */
	private FlightProvider getFlightProvider(HttpServletRequest req) {
		String value = req.getParameter(QUERY_PARAM_FLIGHT_PROVIDER);

		FlightProviderEnum fp = (value == null) ? FlightProviderEnum.jco : FlightProviderEnum.valueOf(value);
		switch (fp) {
		case jco:
			return new JCoFlightProvider();
		}

		throw new IllegalStateException("should never happen");
	}

}
