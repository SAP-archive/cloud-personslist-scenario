package com.sap.personslist.web.pageobjects;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.google.common.base.Function;

/**
 * Page object for personslist view
 */
public class PersonsListPage extends PageObject {

	@FindBy(id = "firstNameFieldId")
	protected WebElement firstName;

	@FindBy(id = "lastNameFieldId")
	protected WebElement lastName;

	@FindBy(id = "addPersonButtonId")
	protected WebElement addPersonButton;
	
	@FindBy(id = "__field0-col0-row0")
	private WebElement firstNameInFirstRowOfList;

	@FindBy(id = "__field1-col1-row0")
	private WebElement lastNameInFirstRowOfList;

	@FindBy(id = "__alert0--btn-OK")
	private List<WebElement> submitConfirmOkButton;

	public PersonsListPage(WebDriver driver) {
		super(driver);
	}

	public static PersonsListPage create(final WebDriver driver) {
		return PageObject.create(driver, PersonsListPage.class);
	}

	@Override
	protected boolean isCurrentPage() {
		return true;
	}

	public String getFirstName() {
		return firstName.getAttribute("value");
	}

	public String getFirstNameInFirstRowOfList() {
		return firstNameInFirstRowOfList.getAttribute("value");
	}

	public String getLastName() {
		return lastName.getAttribute("value");
	}

	public String getLastNameInFirstRowOfList() {
		return lastNameInFirstRowOfList.getAttribute("value");
	}

	public void setFirstName( String text ) {
		firstName.clear();
		firstName.sendKeys(text);
		assertEquals(text, getFirstName());
	}

	public void setLastName( String text ) {
		lastName.clear();
		lastName.sendKeys(text);
		firstName.sendKeys(""); // couldn't find other solution to avoid emptying lastName field when button is clicked
		assertEquals(text, getLastName());
	}

	public PersonsListPage addPerson() {
		addPersonButton.click();
		waitUntil(submitConfirmationIsShown());
		submitConfirmOkButton.get(0).click();
		return PersonsListPage.create(driver);
	}

	private Function<WebDriver, Boolean> submitConfirmationIsShown() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(final WebDriver driver) {
				return !submitConfirmOkButton.isEmpty();
			}
		};
	}
}
