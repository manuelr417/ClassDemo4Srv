<h1>Class Demo4 Srv</h1>
This project shows a simple Node.js server, using a REST API
to serve client requests over HTTP. You will need to install 
<a href="http://nodejs.org/">Node.js</a> in your machine to 
run this server. The server uses the 
<a href="http://expressjs.com">Express</a> module for Node.js.
Express is already added the project, but for new projects you need
to add it, following the commands shown <a href="http://expressjs.com/guide.html">here</a>.
<strong>You will also need to install database server and a Node.js database client
library</strong>. The example is based on PostgreSQL and the node-postgres client library.
However the example can be easily modified to work with MySQL and node-mysql
 
The structure of the project is: <br/>
a) server.js - the server application that feeds data into ClassDemo3.<br/>
b) car.js  - implementation of car object.<br/>
c) package.json - configuration file for the project </br>
d) node_modules - directory with the required Node.js modules.<br/>

<h2>Editing:</h2>
Simply import this project to an IDE, such as Aptana 3. In such case,
use the File->Import->General->Existing Projects into Workspace
and provide the location of the directory for the project.

<h2>Running:</h2>
Node.js runs as a standalone server. From the command prompt, go to the 
project directory  run it as follows: <br/>

> node server.js </br>

The server will run on port 3412.

You will also need to run the database server, and enable the server
to accept TCP/IP connections. Consult the manuals for the database server
of your choice.
