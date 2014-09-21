package com.sap.cloudlabs.connectivity.sflight;


/**
 * Interface <code>FlightProvider</code> provides the service methods to provide flight details 
 * and to book a flight.   
 */
public interface FlightProvider {
		
	public String getFlightList(String cityFrom, String cityTo);
	
	public String bookFlight(String carrier, String connectionNumber, String date);

	public String getFlightDetails(String carrier, String connectionNumber, String date);
}
