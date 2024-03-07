# Introduction
There is an introduction of backend file structure to help you know where your work should begin.

### bin
The www file under this folder only contains some settings of the port and error. You probably do not need to care about it.

### node_modules
This folder contains the node modules that the project depends on. You don't need to check it if not neccessary.

### public
Since the backend is purely for processing data, you can ignore this folder.

### views
Since the backend is purely for processing data, you can ignore this folder.

### routes
I assume you have some knowledge about Express. This folder contains routers that process the request sent by our frontend and send reponse to frontend. You will mainly work on this folder.

### app.js
This file enable the routes and start the backend server.