package com.sap.hana.cloud.sample.data;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.TypedQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.hana.cloud.sample.Person;

/**
 * Data Loader tool for loading application entities (i.e. persons) into the db.
 * 
 */
public class DataLoader {

	private static Logger logger = LoggerFactory.getLogger(DataLoader.class);

	static final String PERSONS_XML_REL_PATH = "com/sap/hana/cloud/sample/data/persons.xml";

	private EntityManagerFactory emf;

	public DataLoader(EntityManagerFactory emf) {
		this.emf = emf;
	}

	/**
	 * Load person entities from respective xml's into DB
	 */
	public void loadData() {
		loadPersons();
	}

	/**
	 * Load persons from persons.xml into DB
	 */
	public List<Person> loadPersons() {
		EntityManager em = emf.createEntityManager();
		TypedQuery<Person> personQuery;
		List<Person> personResults = null;
		try {
			em.getTransaction().begin();
			personQuery = em
					.createQuery("SELECT p FROM Person p", Person.class);
			personResults = personQuery.getResultList();
			if (personResults.size() > 0) {
				logger.info("Already " + personResults.size()
						+ " person entities already available in the db");
			} else {
				new XmlParser().readPersons(em, PERSONS_XML_REL_PATH);
				em.getTransaction().commit();
				personQuery = em.createQuery("SELECT p FROM Person p",
						Person.class);
				personResults = personQuery.getResultList();
				logger.info(personResults.size()
						+ " person entities were loaded into the db");
			}
		} catch (Exception e) {
			logger.error("Exception occured", e);
		} finally {
			em.close();
		}
		return personResults;
	}
}
