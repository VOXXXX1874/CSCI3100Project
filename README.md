# CSCI3100Project
### Introduction
This is our CSCI3100 project Gobang. This project use React as frontend framework and Express as backend framework. Frontend and backend are seperated and placed in folder "client" and "api" respectively.

### Setup
Assume that you have installed node.js. Download and unzip the package into whatever path you like. Open cmd and type command (change [PATH] to your path):
```
cd [PATH]/CSCI3100Project/client
```
Install the dependencies with 
```
npm install
```
Start the server with
```
npm start
```
Open the url http://localhost:3000 in your browser and you will see a single head "This is login page", which means you setup the front end successfully. Next, open a new cmd and go to the folder of backend:
```
cd [PATH]/CSCI3100Project/api
npm install
npm start
```
After the backend server starts, refresh the http://localhost:3000 page. If you can find "API works properly" appear under the head, then you successfully setup backend server too. What's more, you can also open url http://localhost:9000, where the backend runs. If you can see some message about Express, then you successfully setup backed server.

### TO DO
Change the css from flex to grid since the components in one page will not change frequently. The first stable naive version.

### History
3/7: Initialize the backend and frontend
3/7: Change every component to pure function
3/8: Build basic four main pages and the way to switch from page to page. Build a simple chessboard adapted from the React tic-tac-toe tutorial.

### Documents
All the documents such as high-level design, data flow diagram of this project is placed in folder "Documents"


