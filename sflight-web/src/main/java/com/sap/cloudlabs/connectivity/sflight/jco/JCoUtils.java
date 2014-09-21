package com.sap.cloudlabs.connectivity.sflight.jco;

import com.sap.conn.jco.JCoMetaData;
import com.sap.conn.jco.JCoRecord;
import com.sap.conn.jco.JCoTable;

/**
 * Utility class providing some helper methods for JCo.
 */
public class JCoUtils {

	private JCoUtils() {		
	}

	/** 
	 * Writes a JCo table as JSON array. 
	 * 
	 * Example: 
	 * [ {"name":"Pete", "age":18}, {"name":"Jane", "age":25} ]
	 * 
	 * @param table a JCoTable instance
	 * @return JSon string representing the provided table
	 * @throws NullPointerException if table is null
	 */
	public static String tableToJson(JCoTable table) {
		if (table==null) {
			throw new NullPointerException("table is null");
		}
		
		StringBuilder sb = new StringBuilder(2024);
		
		if (!table.isEmpty()) {
			sb.append("{\"data\":[");
			for (int i=0; i<table.getNumRows(); i++) {
				table.setRow(i);
				if (i>0) {
					sb.append(",");
				}				
				sb.append(recordToJson(table));
			}
			sb.append("]}");
		} else {
			sb.append("{}");
		}
		return sb.toString();
	}
	
	/** 
	 * Writes a JCo record as JSON object. 
	 * 
	 * Example: 
	 * {"name":"Pete", "age":18}
	 * 
	 * @param record a JCoRecord instance
	 * @return JSon string representing the provided record
	 * @throws NullPointerException if record is null
	 */	
	public static String recordToJson(JCoRecord record) {
		if (record == null) {
			throw new NullPointerException("record is null");
		}

		StringBuilder sb = new StringBuilder(524);
		JCoMetaData metaData = record.getMetaData();
		sb.append("{");
		for (int i = 0; i < metaData.getFieldCount(); i++) {
			if (i>0) {
				sb.append(",");
			}
			int typeId = metaData.getType(i);
			String value = null;
			switch (typeId) {
			case JCoMetaData.TYPE_INT:
			case JCoMetaData.TYPE_INT1:
			case JCoMetaData.TYPE_INT2:
			case JCoMetaData.TYPE_DECF16:
			case JCoMetaData.TYPE_DECF34:
			case JCoMetaData.TYPE_FLOAT:
				value = record.getString(i);
				break; 
			default: // all the remaining types are rendered as strings
				value = "\"" + record.getString(i) + "\"";
				break;
			}
			sb.append("\"" + metaData.getName(i) + "\":").append(value);
		}
		sb.append("}");
		return sb.toString();
	}
}
