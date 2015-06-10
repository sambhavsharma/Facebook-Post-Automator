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


# How it works?
You need to add Facebook Groups first and then start adding posts. Once you have everything in place call the /publish URL of the app and it will make a round of publishing posts on groups. In post-list view, you can see which post will be posted to which group in the next round.

# Example Scenario:

1. Let's say we add a group with id g1. This creates a document in database in collection sequence with doc_id=1 and a seq array which will look like this -> [g1]

2. Now add groups g2 and g3. The seq array is updated to [g1,g2,g3].. This is our current sequence of publishing.

3. Now let's say you add post p1. This post will get an execution seq [g1,g2,g3] and the seq array will now be rotated to [g2,g3,g1]

4. Now if you add another post p2, it will get an execution sequence [g2,g3,g1] and the seq array will again be rotated and will become [g3,g1,g2] and so on.

5. Everytime the /publish URL is called the posts with non empty seq arrays are fetched and the first element of the aaray is popped. This post is then published to the group with popped id, which competes one round of posting.

6. Now you can call this URL via a cron job or any other scheduler.
