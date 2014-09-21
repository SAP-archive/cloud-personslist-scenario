package com.sap.personslist.web;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.sap.personslist.web.pageobjects.PersonsListPage;

public class PersonsListIT extends UiTestBase {

	@Test
	public void testCreateReview() {
		driver.get(serverUrl + applicationPath);
		PersonsListPage personsListPage = PersonsListPage.create(driver);

		personsListPage.setFirstName("John");
		personsListPage.setLastName("Smith");
		personsListPage = personsListPage.addPerson();
		assertEquals("First name John was not added", "John", personsListPage.getFirstNameInFirstRowOfList());
		assertEquals("First name Smith was not added", "Smith", personsListPage.getLastNameInFirstRowOfList());
	}
}
