package com.sap.hana.cloud.sample.data;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.XMLEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.hana.cloud.sample.Person;

/**
 * xml parser implementation
 * 
 */
public class XmlParser {
	static Logger logger = LoggerFactory.getLogger(XmlParser.class);

	// tags defined in persons.xml
	static final String PERSON = "person";
	static final String PERSON_FIRST_NAME = "firstName";
	static final String PERSON_LAST_NAME = "lastName";

	private InputStream in = null;
	private XMLEventReader eventReader = null;
	protected Boolean status;

	/**
	 * Parse persons.xml and fill the list of person entities
	 * 
	 * @param personsXml
	 * @return filled the list of person entities according to parsed personsXml
	 */
	public List<Person> readPersons(EntityManager em, String personsXml) {
		List<Person> persons = new ArrayList<Person>();

		try {
			XMLInputFactory inputFactory = XMLInputFactory.newInstance();
			in = getResourceAsInputStream(personsXml);
			eventReader = inputFactory.createXMLEventReader(in);
			Person person = null;
			while (eventReader.hasNext()) {
				XMLEvent event = eventReader.nextEvent();
				if (event.isStartElement()) {
					String startElementName = event.asStartElement().getName()
							.getLocalPart();
					if (startElementName.equals(PERSON)) {
						// create person entity
						person = new Person();
					} else if (startElementName.equals(PERSON_FIRST_NAME)) {
						event = eventReader.nextEvent();
						person.setFirstName(getEvent(event));
					} else if (startElementName.equals(PERSON_LAST_NAME)) {
						event = eventReader.nextEvent();
						person.setLastName(getEvent(event));
					}
				} else if (event.isEndElement()) {
					// persist person entity and add to persons list
					String endElementName = event.asEndElement().getName().getLocalPart();
					if (endElementName.equals(PERSON)) {
						em.persist(person);
						persons.add(person);
					}
				}
			}
		} catch (Exception e) {
			logger.error("Exception occured", e);
			status = false;
		} finally {
			try {
				in.close();
				eventReader.close();
			} catch (IOException e) {
				logger.error("IO Exception occured", e);
				status = false;
			} catch (XMLStreamException e) {
				logger.error("XMLStream exception occured", e);
				status = false;
			}
		}
		return persons;

	}

	/**
	 * Find a resource file and convert a Resource File as input stream
	 * 
	 * @param xmlFile
	 *            Resource file which needs to be converted to input stream
	 * @return resource as input stream
	 */
	InputStream getResourceAsInputStream(String xmlFile) {
		return XmlParser.class.getClassLoader().getResourceAsStream(xmlFile);
	}

	/**
	 * Check if node has text and return it else return null.
	 * 
	 * @param event
	 * @return text of the node
	 */
	public String getEvent(XMLEvent event) {
		if (event.isCharacters()) {
			return event.asCharacters().getData();
		} else {
			return null;
		}
	}
}
