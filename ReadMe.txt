To run the SFlight sample application in your local development environment, you need to execute steps 1. to 4. below. 

Pre-requisite for the SFlight sample application: 
=================================================

The SFlight application demonstrates how to use JCo/RFC in a cloud application to connect to an on-premise ABAP system.  
It is therefore a pre-requisite to have an ABAP system, version 4.6C or later, accessible locally in order to run the sample. 
In those versions, the SFLIGHT model is available by default. In order to use the SFLIGHT model on your ABAP system, you 
need to make sure that the flight data has been generated, as it is described here: 
http://help.sap.com/saphelp_erp60_sp/helpdata/en/db/7c623cf568896be10000000a11405a/content.htm


Table of Contents
=================

1.  Installation Steps
1.1   Install (latest) Java 7 JDK
1.2   Install Eclipse IDE for Java EE Developers (Kepler (4.3.1) SR1 Package)
1.3   Install HCP Eclipse Tools
1.4   Download SAP HANA Cloud Platform SDK
1.5   Install Egit

2.  Download sample application from Github

3.  Import and Maven build the sample application
3.1   Import SFlight sample as Maven Project
3.2   Maven build of SFlight sample

4.  Run sample application 
4.1   On local HANA Cloud Platform test server
4.2   On SAP HANA Cloud Platform

1. Installation Steps (for SFlight sample application)
=======================================================
The following description are for experienced Eclipse Java Developers (+ minimum Maven and EGit knowledge) and therefore 
kept short.

1.1   Install (latest) Java 7 JDK
1.2   Install Eclipse IDE for Java EE Developers (current release: Kepler (4.3.1))
      - http://www.eclipse.org/downloads/
1.3   Install HCP Eclipse Tools
      - In Eclipse: Help > Install new Software...
      - https://tools.hana.ondemand.com/kepler
      - Install category "SAP HANA Cloud Platform Tools"
1.4   Download SAP HANA Cloud Platform SDK
      - open https://tools.hana.ondemand.com
      - find download link with name "neo-java-web-sdk-<current-version>.zip" 
       (where <current-version> is e.g. "1.44.0.1" or higher e.g. 1.x.y.z)
      - download and extract the content of this zip to your pc (e.g. "c:\<local-neo-sdk-path>")
1.4.1 Set up SAP HANA Cloud Runtime Environment
      - Eclipse menu: Window > Preferences; then Server > Runtime Environment.
      - On Server Runtime Environments page: Choose Add... button; then Select SAP > SAP HANA Cloud and choose Next
      - In "Use SAP HANA Cloud Platform SDK from the following location" field enter the <local-neo-sdk-path> path
        (the one where you extracted the downloaded neo-sdk in 1.5; e.g. "c:\<local-neo-sdk-path>") 
1.5   Install Egit
      - In Eclipse: Help > Eclipse Marketplace...
      - Search for "Egit" and install the "EGit - Git Team Provider"


2. Download sample application from Github
===========================================

If you know already how to work with EGit you might use the below short description to download the PersonsList Extension Samples.
Developers which do not have any experience with EGit can execute the detailed tutorial of http://scn.sap.com/docs/DOC-41427 (see Chapter 1.2.1)

1. Open https://github.com/SAP/cloud-personslist-scenario/ and copy the Git URL to clipboard
2. In Git Repositories View clone the cloud-personslist-scenario Git Repository and add it to the view
3. By default the origin/master branch is checked out as local master branch
4. From the Remote tracking branch origin/Extension-005 create a local branch and check in out
The checked out local branch contains the sources of the PersonsList Extension-005 sample


3. Import and Maven build the sample application
=================================================

3.1 Import SFlight application as Maven Project
------------------------------------------------
1. Eclipse menu: File > Import... ; Maven > Existing Maven Projects; choose Next
2. Choose Browse... and navigate to location C:<local_path_to_cloud-personslist-scenario> 
  (the location where you downloaded before the cloud-personslist-scenario Git Repository)
3. Choose Finish to import the web application project with name sflight-web
  
3.2 Maven build of SFlight application
---------------------------------------
1. In Eclipse Project Explorer, select sflight-web node and open context menu 
2. Choose Run As > Maven build... ; Edit Configuration dialog opens 
3. Enter "clean install" as Goals
4. Choose Run to start the Maven build 

The Maven build should finish with a BUILD SUCCESS message.


4. Run sample application
=========================
You can either run the SFlight sample on local test server (4.1) as part of eclipse or publish and run it on SAP HANA Cloud Platform (4.2).

4.1 On local HANA Cloud test server
-----------------------------------
1. In Eclipse Project Explorer view select project node sflight-web.
2. On the selected project node open context menu and choose Run As > Run on Server. 
3. Window Run On Server opens. Make sure that the Manually define new server option is selected. 
4. Select SAP > SAP HANA Cloud local runtime as server type 
5. Choose Finish.
This deploys and starts the SFlight application. 
Before the application works you need to configure the RFC destination that points to the used ABAP system and add a test user to the local server:

1. In Eclipse Project Explorer, copy the destination dest_sflight.jcoDestination from folder sflight-web/src/main/webapp/destinations into the root directory of 
   your local SAP HANA Cloud Platform test server located in the Eclipse Project Explorer under "Servers > SAP HANA Cloud Platform local runtime-config". 
2. Open the destination dest_sflight.jcoDestination in Eclipse with a text editor and adopt the destination configuration to point to the locally accessible ABAP 
   system you want to use for the sample application. The RFC destination properties are explained in detail here: 
   https://help.hana.ondemand.com/help/frameset.htm?e184daba118b46679c6968567bacc98e.html
3. Setup steps to create a test User for local server
   - In the Eclipse IDE, open the Servers view.
   - Double-click on the Local Server node. The local server editor opens.
   - Switch to the Users tab.
   - Click on green '+' icon in 'All Users' section to add a new user
     Specify a user name and password (e.g. user name: admin, password: admin)
   - Save editor
4. Now run the application again and log on with the before created user

4.2 On SAP HANA Cloud Platform
------------------------------

4.2.1 Register for a free SAP HANA Cloud Platform Developer Account

  (this step is only needed in case you don't have an account yet on SAP HANA Cloud Platform)

  1. open https://account.hanatrial.ondemand.com/ > Register
     -> After registration you have a 
     SAP HANA Cloud Developer Account name: "<your p-User>trial" (p-user with lower case)
     (SCN) user name: <your p-User> (alternatively <e-mail> as user)
     (SCN) user account password: <********>

4.2.2 Publish and Run the SFlight application on your Trial Developer Account

  1. In Eclipse Project Explorer select sflight-web project node
  2. Open context menu Run As > Run on Server.
  3. Make sure that 'Manually define a new server' option is selected.
  4. Change default Server's host name 'hana.ondemand.com' to 'hanatrial.ondemand.com'
  5. Choose Next
  6. Enter Application name e.g. 'sflight' (only small letters(a-z) and numbers are allowed)
  7. Then enter your SAP HANA Cloud Platform Developer Account name (<p-user>trial), (SCN) User name (<p-user>) and your password. 
  8. Choose Finish.

After about a minute the SFlight application, running on SAP HANA Cloud Platform, is launched in a Web browser.
  
4.2.3 Configure the RFC destination for the SFlight application 

  After deployment, you need to configure the RFC destination that points to the used on-premise ABAP system: 
  
  1. In Eclipse Server view, open the server UI by double clicking the server. 
  2. Navigate into the "Connectivity" tab.
  3. Click on the "Import existing Destination" button and browse to the dest_sflight.properties destination located in the 
     sflight-web/src/main/webapp/destinations folder of the Eclipse project. 
  4. Adopt the destination configuration to point to your on-premise ABAP system. 
     The RFC destination properties are explained in detail here: https://help.hana.ondemand.com/help/frameset.htm?e184daba118b46679c6968567bacc98e.html
     Note: The properties are pre-configured with following two values:  
        jco.client.mshost=abap.sflight.host
        jco.client.r3name=FLI
     These values are relevant for the configuration of the ABAP system in the SAP HANA Cloud Connector, section 4.2.4. We recommend to leave them as 
     is so that the configuration done in 4.2.4 fits to the destination configuration. 
  5. Save the application. This will deploy the configuration into the cloud. 

4.2.4 Configure the SAP HANA Cloud Connector to expose the used ABAP system

  1. Install the Cloud Connector in your on-premise network in which the ABAP system is located: 
     https://help.hana.ondemand.com/help/frameset.htm?57ae3d62f63440f7952e57bfcef948d3.html
  2. Go through the initial configuration steps of the Cloud Connector, i.e. set an Administrator password and 
     connect it against your trial account: 
     https://help.hana.ondemand.com/help/frameset.htm?db9170a7d97610148537d5a84bf79ba2.html
  3. Configure the ABAP system in the Cloud Connector the SFlight application should have access to:  
     Navigate into the "Access Control" view of the Cloud Connector. 
     Under "Mapping Virtual to Internal System" click the "Add..." button.  
     Enter and save following values in the Add System Mapping dialog:  
        Virutal Host = abap.sflight.host
        Virtual Port = sapmsFLI
        Interal Host = <physical host name of the ABAP system>
        Interal Port = <port of the ABAP system>
        Protocol = RFC
        Backend Type = ABAP System
   4. Select the newly created entry in the "Mapping Virtual to Internal System" table.
   5. In the "Resources..." table at the bottom, add the BAPIs the SFlight application shall get access to. 
      Enter following 3 entries using the "Add..." button: 
      a. Function Name: BAPI_SBOOK  
         Naming Policy: Prefix
      b. Function Name: BAPI_SFLIGHT
         Naming Policy: Prefix
      c. Function Name: BAPI_TRANSACTION_COMMIT
         Naming Policy: Exact Name
        
Now you can refresh the SFlight application in the browser. The application should now show flight data fetched from the ABAP system, 
after you clicked on the "SFlight Model in ABAP" link at the very top of the application. This shall show a JSON response with flight 
data.   
