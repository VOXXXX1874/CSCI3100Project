### Introduction
There is an introduction of frontend file structure to help you know where your work should begin.

### node_modules
This folder contains the node modules that the project depends on. You don't need to check it if not neccessary.

### public
This folder contains the .html file and some images and icons. Since we use React to write a single page application, you seldom modify the the files under this folder unless you want to include some images.

### src
I assume you have some knowledge about React. This folder contains all the files that you will frequent work on. The file App.js is the root of the render tree. Pages folder contains 4 main pages of the project specified in high level design document. They can be treated as the children of the root. Under each page folder there are some special components. All other generic components are placed under the component folder.