package com.sap.personslist.web.pageobjects;

import static org.junit.Assert.fail;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

public abstract class PageObject {

	private static final long TIMEOUT_IN_SECONDS = 10;

	protected final WebDriver driver;

	private String errorMessage;

	protected PageObject(final WebDriver driver) {
		this.driver = driver;
	}

	protected final <P extends PageObject> P create(final Class<P> pageClass) {
		return create(driver, pageClass);
	}

	public static <P extends PageObject> P create(final WebDriver driver,
			final Class<P> pageClass) {
		final P page = PageFactory.initElements(driver, pageClass);
		page.checkIfWeAreOnCurrentPage();
		return page;
	}

	protected final void checkIfWeAreOnCurrentPage() {
		waitUntil(weAreOnCurrentPage());
	}

	/**
	 * Fluently wait until a condition is fulfilled or time is up. Fails with
	 * the stored error message if the timeout occurs.
	 * 
	 * @param waitCondition
	 * 
	 * @see #check(boolean, String)
	 */
	protected final void waitUntil(
			final Function<WebDriver, Boolean> waitCondition) {
		try {
			errorMessage = null;
			new WebDriverWait(driver, TIMEOUT_IN_SECONDS).until(waitCondition);
		} catch (final TimeoutException e) {
			fail("Wait condition failed: " + errorMessage);
		}
	}

	private Function<WebDriver, Boolean> weAreOnCurrentPage() {
		return new Function<WebDriver, Boolean>() {
			@Override
			public Boolean apply(final WebDriver driver) {
				return isCurrentPage();
			}
		};
	}

	protected abstract boolean isCurrentPage();

	/**
	 * To be used by subclasses, inside {@link #isCurrentPage()} or
	 * #waitUntil(Function) Checks whether the element is on the screen.
	 * 
	 * @see #checkElementIsDisplayed(WebElement, String)
	 */
	protected final boolean checkElementIsDisplayed(final WebElement element) {
		String id = "<unknown>";
		try {
			id = element.getAttribute("id");
		} catch (final WebDriverException e) {
			System.err.println("Error retrieving element id: " + element);
		}
		return checkElementIsDisplayed(element, id);

	}

	/**
	 * To be used by subclasses, inside {@link #isCurrentPage()} or
	 * {@link #waitUntil(Function)} . In addition to checking whether the
	 * element is on the screen it stores an errorMessage if the element is not
	 * found, which is displayed if the page transition or wait condition fails.
	 */
	protected final boolean checkElementIsDisplayed(final WebElement element,
			final String elementName) {
		try {
			if (!element.isDisplayed()) {
				this.errorMessage = "Element not displayed: " + elementName;
				return false;
			}
		} catch (final NoSuchElementException e) {
			this.errorMessage = "Element not found: " + elementName;
			return false;
		}
		return true;
	}

	/**
	 * To be used by subclasses, inside isCurrentPage and stores an errorMessage
	 * if the condition is false, which is displayed if the page transition
	 * fails.
	 */
	protected final boolean check(boolean condition, String errorMessage) {
		this.errorMessage = errorMessage;
		return condition;
	}
}
