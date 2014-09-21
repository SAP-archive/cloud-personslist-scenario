package com.sap.personslist.web;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

public class UiTestBase {

	@Rule
	public TestName testName = new TestName();

	public static String serverUrl = System.getProperty(
			"integration.test.server.url", "http://localhost:9090");

	public static String applicationPath = System.getProperty(
			"integration.test.application.path",
			"/personslist-repo-web/index.html");

	public static File screenshotFolder = new File(System.getProperty(
			"integration.test.screenshot.path", "target/screenshots"))
			.getAbsoluteFile();

	public static WebDriver driver;

	@BeforeClass
	public static void setupClass() throws Exception {
		setupScreenshotFolder();
		setupFirefox();
	}

	private static void setupScreenshotFolder() {
		if (!screenshotFolder.exists()) {
			screenshotFolder.mkdirs();
		}
		System.out.println("Screenshots are saved in " + screenshotFolder);
	}

	private static void setupFirefox() {
		final DesiredCapabilities capabilities = new DesiredCapabilities();
		final String proxyHost = System.getProperty("http.proxyHost");
		final String proxyPort = System.getProperty("http.proxyPort");
		if (proxyHost != null) {
			System.out
					.println("Configuring Firefox Selenium web driver with proxy "
							+ proxyHost
							+ (proxyPort == null ? "" : ":" + proxyPort)
							+ " (requires Firefox browser)");
			final Proxy proxy = new Proxy();
			final String proxyString = proxyHost
					+ (proxyPort == null ? "" : ":" + proxyPort);
			proxy.setHttpProxy(proxyString).setSslProxy(proxyString);
			proxy.setNoProxy("localhost");
			capabilities.setCapability(CapabilityType.PROXY, proxy);
		} else {
			System.out
					.println("Configuring Firefox Selenium web driver without proxy (requires Firefox browser)");
		}

		driver = new FirefoxDriver(capabilities);
		driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
	}

	@AfterClass
	public static void teardownClass() {
		driver.quit();
	}

	@After
	public void tearDown() throws Exception {
		takeScreenshot();
	}

	private void takeScreenshot() throws IOException {
		final File tempFile = ((TakesScreenshot) driver)
				.getScreenshotAs(OutputType.FILE);
		final String targetName = getClass().getSimpleName() + "."
				+ testName.getMethodName() + ".png";
		final File targetFile = new File(screenshotFolder, targetName);
		FileUtils.copyFile(tempFile, targetFile);
		System.out.println("Screenshot for test " + testName.getMethodName()
				+ " saved in " + targetFile.getAbsolutePath());
	}
}
