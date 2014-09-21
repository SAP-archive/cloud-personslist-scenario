For Running the PersonsList Extension Samples on your development environment you need to execute 1., 2., 3. and 4.1.

Table of Contents
=================

1.  Installation Steps
1.1   Install (latest) Java 7 JDK
1.2   Install Eclipse IDE for Java EE Developers (Kepler (4.3.2) SR2 Package)
1.3   Install SAP Development Tools for Eclipse
1.4   Download SAP HANA Cloud Platform SDK

2.  Download Samples from Github

3.  Import and Maven build the Samples
3.1   Import Extension-000 sample as Maven Project
3.2   Maven build of Extension-000 sample

4.  Run Samples 
4.1   On local Java Web Server
4.2   On SAP HANA Cloud Platform


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
4. From the Remote tracking branch origin/Extension-000 create a local branch and check in out
The checked out local branch contains the sources of the PersonsList Extension-000 sample


3. Import and Maven build the Samples
=====================================
3.1 Import Extension-000 sample as Maven Project
------------------------------------------------
1. Eclipse menu: File > Import... ; Maven > Existing Maven Projects; choose Next
2. Choose Browse... and navigate to location C:<local_path_to_cloud-personslist-scenario> 
  (the location where you downloaded before the cloud-personslist-scenario Git Repository)
3. Choose Finish to import the three project with names personslist-repo, personslist-repo-web and personslist-repo-model-jpa

These steps are described in more detail in  http://scn.sap.com/docs/DOC-41427 (see Chapter 1.2.2)
  
3.2 Maven build of Extension-000 sample
---------------------------------------
1. Select personslist-repo/pom.xml and open context menu 
2. Choose Run As > Maven build... ; Edit Configuration dialog opens 
3. Enter "clean install" as Goals
4. Choose Run to start the Maven build 
The Maven build should finish with a BUILD SUCCESS message

These steps are described in more detail in  http://scn.sap.com/docs/DOC-41427 (see Appendix A1 and Maven configuration in chapter 1.6)


4. Run Samples 
==============
You can either run the PersonsList Extension samples on local test server (4.1) as part of eclipse or publish and run it on SAP HANA Cloud (4.2)

Before you continue with 4.1 or 4.2 make sure that an external Web Browser (e.g. Chrome) is launched:
1. Eclipse menu: Choose Window > Preferences; then General > Web Browser. 
2. Choose option 'Use external Web Browser' and select 'Default system web browser'. Confirm with OK.

4.1 On local Java Web Server
----------------------------
1. In Eclipse Project Explorer view select project node personslist-repo-web 
2. On the selected project node open context menu and choose Run As > Run on Server. 
3. Window Run On Server opens. Make sure that the Manually define new server option is selected. 
4. Select 'SAP' > 'Java Web Server' as server type 
5. Choose Finish.
After about a minute the PersonsList Extension-000 application, running on local Java Web Server, is launched with the external Web browser you configured before.

These steps are described in more detail in  http://scn.sap.com/docs/DOC-41427 (see Appendix A1.1)

4.2 On SAP HANA Cloud Platform
------------------------------
Before you can publish your PersonsList Extension sample on SAP HANA Cloud Platform you need to register for a free developer trial account

4.2.1 Register for a free SAP HANA Cloud Platform Developer Account

  1.open https://account.hanatrial.ondemand.com/ > Register
   -> After registration you have a 
   SAP HANA Cloud Developer Account name: "<your p-User>trial" (p-user with lower case)
   (SCN) User name: <your p-User> (alternatively <e-mail> as user)
   (SCN) User account password: <********>

4.2.2 Publish and Run PersonsList Application on your Trial Developer Account

  1. Select personslist-repo-web project node
  2. Open context menu Run As > Run on Server.
  3. Make sure that 'Manually define a new server' option is selected.
  4. Select 'SAP' > 'SAP HANA Cloud Platform' as server type 
  5. Change default Server’s host name 'hana.ondemand.com' to 'handtrial.ondemand.com'
  6. Choose Next
  6. Enter Application name e.g. 'sample000' (only small letters(a-z) and numbers are allowed)
  8. Then enter your SAP HANA Cloud Developer Account name (<p-user>trial), (SCN) User name (<p-user>) and your password. 
  9. Choose Finish.
After about a minute the PersonsList Extension-000 application, running on SAP HANA Cloud Platform, is launched with the external Web browser you configured before.

These steps are described in more detail in  http://scn.sap.com/docs/DOC-41427 (see Appendix A1.2 shortly and in chapter 5 in more detail)
