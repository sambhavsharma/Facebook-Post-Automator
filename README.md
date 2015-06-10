# Facebook-Post-Automator
Automates Publishing of Posts on Groups

-- To find the group ID of a Facebook Group

http://lookup-id.com/


-- Request to get access_token

https://www.facebook.com/dialog/oauth?client_id={Your-App-Client-ID}&redirect_uri=http://{Your-App-Host}/auth&display=popup&scope=user_groups,read_insights,publish_actions&response_type=code

OR Use the Auth Page in the App. The token is also saved in access_token file for future reference.

This is a Sails.js Web application which needs to be hosted on a server.

Pre requisites: MongoDB needs to be installed.

All the configurations are in the config folder. The important ones are:

properties.js: This file contains your facebook app properties.

connections.js: This file contains your MongoDB properties.

local.js: This file contains your app port and environment

routes.js: All your routes

models.js: Which DB Connection to use and DB migration properties.

The /publish url publishes the posts on groups and round robin fashion. You need to call this

URL in your cron job (for eg via CURL)

Steps(Ubuntu): 

# Install Node.js

$ sudo apt-get install python-software-properties python g++ make

$ sudo add-apt-repository ppa:chris-lea/node.js

$ sudo apt-get update

$ sudo apt-get install nodejs

# Intsall Sails.js

$ sudo npm -g install sails


Download dependencies- In the root of the project, run:

$ npm install

Run Node Server (Alternatively it is suggested that you run forever on your production server)

$ node app.js
