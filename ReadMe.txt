For Running the PersonsList Extension Samples on your development environment you need to execute 1., 2., 3. and 4.1.

Table of Contents
=================

1.  Installation Steps
1.1   Install (latest) Java 7 JDK
1.2   Install Eclipse IDE for Java EE Developers (Kepler (4.3.2) SR2 Package)
1.3   Install SAP Development Tools for Eclipse
1.4   Download SAP HANA Cloud Platform SDK

2.  Download Samples from Github

3.  Import Extension-003 Sample as Maven Project

4.  Run Samples 
4.1   JavaScript Unit Tests in web browser
4.2   JavaScript Unit Tests as part of Maven build


1. Installation Steps (for PersonsList Extensions)
==================================================
The following description for experienced Eclipse Java Developers (+ minimum Maven and EGit knowledge) and therefore kept very short.
If you think the below steps are too short then use the detailed installation description, only Chapter 1, of http://scn.sap.com/docs/DOC-46868

1.1   Install (latest) Java 7 JDK
1.2   Install Eclipse IDE for Java EE Developers (Kepler (4.3.2) SR2 Package)
      - http://www.eclipse.org/downloads/packages/release/Kepler/SR2
1.3   Install SAP Development Tools for Eclipse
      - In Eclipse: Help > Install new Software...
      - https://tools.hana.ondemand.com/kepler
      - Install category "SAP HANA Cloud Platform Tools"
1.4   Download SAP HANA Cloud Platform SDK
      - open https://tools.hana.ondemand.com
      - find download link with name "neo-java-web-sdk-<current-version>.zip" 
       (where <current-version> is e.g. "1.61.19" or higher e.g. 1.x.y.z)
      - download and extract the content of this zip to your pc (e.g. "c:\<local-neo-sdk-path>")
1.4.1 Set up SAP HANA Cloud Platform Runtime Environment
      - Eclipse menu: Window > Preferences; then Server > Runtime Environment.
      - On Server Runtime Environments page: Choose Add... button; then Select SAP > Java Web and choose Next
      - In "Use Java Web SDK from the following location" field enter the <local-neo-sdk-path> path
        (the one where you extracted the downloaded neo-sdk in 1.4; e.g. "c:\<local-neo-sdk-path>") 


2. Download Samples from Github
===============================
If you know already how to work with EGit you might use the below short description to download the PersonsList Extension Samples.
Developers which do not have any experience with EGit can execute the detailed tutorial of http://scn.sap.com/docs/DOC-41427 (see Chapter 1.2.1)

1. Open https://github.com/SAP/cloud-personslist-scenario/ and copy the Git URL to clipboard
2. In Git Repositories View clone the cloud-personslist-scenario Git Repository and add it to the view
3. By default the origin/master branch is checked out as local master branch
4. From the Remote tracking branch origin/Extension-003 create a local branch and check in out
The checked out local branch contains the sources of the PersonsList Extension-003 sample


3. Import Extension-003 Sample as Maven Project
===============================================
1. Eclipse menu: File > Import... ; Maven > Existing Maven Projects; choose Next
2. Choose Browse... and navigate to location C:<local_path_to_cloud-personslist-scenario> 
  (the location where you downloaded before the cloud-personslist-scenario Git Repository)
3. Choose Finish to import the three project with names personslist-repo, personslist-repo-web and personslist-repo-model-jpa

These steps are described in more detail in  http://scn.sap.com/docs/DOC-41427 (see Chapter 1.2.2)
  
4. Run Samples 
==============
You can either run the JavaScript Unit Tests in web browser (4.1) or as part of the Maven build by executing PhantomJS (4.2)

4.1 JavaScript Unit Tests in web browser
----------------------------------------
1. Select personslist-repo-web/pom.xml and open context menu 
2. Choose Run As > Maven build... ; Edit Configuration dialog opens 
3. Enter "mvn jasmine:bdd" as Goals
4. Choose Run to start the Maven build
In the console output you will find at the localhost URL 'http://localhost:<port>' (with a random <port>) 
5. Open the localhost URL in web browser to execute the JavaScript Unit Tests for the PersonsList UI5 Applications 

4.2 JavaScript Unit Tests as part of Maven build
------------------------------------------------
1. Select personslist-repo-web/pom.xml and open context menu 
2. Choose Run As > Maven build... ; Edit Configuration dialog opens 
3. Enter "jasmine:test" as Goals
4. Choose Run to start the Maven build 
Find the executed tests in the console output under 'J A S M I N E   S P E C S'
