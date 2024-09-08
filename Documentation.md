Documentation for all the modules that are used in the Shorten-a-railway service created by @Stefenmarg.

#### Default.js 

'default.js' handles setting up all the needed variables and custom modules that have been developed for this server.

It exports 1 Function and 7 variables

The 1 Function 'setup()' imports all the custom modules and saves them into a non constant object variable ex:'defaults.setup([]);'
and returns them all in the given object.

The 7 variables and their usage is:
* 'databasePath' has the path to the main database.
* 'backupIntervalMS' has the time in milliseconds that the backups must differ by.
* 'backupFolder' has the folder in which the backups should be saved.
* 'backupPaths' has all the paths that should be copied and have a backup.
* 'logTypes' has all the diffrent types of logs that can be used in the service.
* 'logPath' has the path in which the logs will be saved.
* 'serverPort' has the port that the API & Server should listen to.

#### Modules/Hash.js 
'Hash.js' handles creating a salt and a sha512 hash off a string of text.

It exports 1 Function 'genHash(String)' and returns a json object with 2 attributes: "salt" and "hash" with their respective data.

Checks are performed to check on whether a string is given with length bigger than 0 and throws an error if requirements are not met.

#### Logs/LogManager.js
'LogManager.js' exports 1 function 'writeLog()' that takes 3 variables:
* 1) The object returned by running 'setup()' from default.js
* 2) A String that contains the log type that can be one of the logTypes; if not writes the last String of the 'logTypes' 
* 3) A string that contains the log content
	.
And it prints the log content in the console that cannot be turned off (atleast for the time being it will remain on, verbose options will be introduced if they seem needed).

#### Endpoints/EndpointManager.js
'EndpointManager' exports 6 functions and 1 variable.

The variable exported is the setting for the rate limiting the creating and the following the links and can be accessed by using 
```Javascript
const dbManager = require('./Database/DatabaseManager');
const rateLimit = dbManager.rateLimit;
```
---

All the functions that can be found in the EndpointManager get 3 variables:
* 1) req provided by the expressjs endpoint as it is the request info.
* 2) res provided by the expressjs endpoint as it is the responce funvtion.
* 3) The object returned by running 'setup()' from default.js
	
What they return is their respective frontend files like: 'index.html', 'new.html', '404.html', 'takedown.html'
Except for the 'req()' and 'v()' parts that process data instead of delivering sttic sites.

--- 	
The req() function recieves the query data that is sent by the form, gets the URL and EMAIL entries
creates the hash and the salt of the email, deletes the email variable and then submitis all the above data to a database entry.
After the entry gets processed we search by the hash for the url id and return the ID with the success or failure flag to signal 
the user if the request is completed successfully.

---

The v() function recieves the id that we need to redirect to and then we send a query to the database to try ad find the url with the id
submitted, if it is found a json object gets returned ith the url and if it is not found we send an undefined object and detect that.
Upon detection we simply redirect to our 404 page.

#### Endpoints/Files/new.hmtl
'new.html' is the only of the htmls that are not fully static since it is also handling the responces of the server during the request of a shortened link.

For the first part it contains a form that takes the user's input (email, url). On submission, it takes from the form the content that the user has filled and creates a get request in the 
/req endpoint using /req?email=address&url=address. There are checks run in the background, checking if the url and/or email are filled in, checking for the '@'' sign checking for the '.' 
sign after the domain ex: '.com' and if everything seems legit it sends the request. If it gets a success it shows success + the shortened link , if it is a failure it shows Failure + the issue.
It must be noted that there is a rate limit in the endpoint.


#### Database/DatabaseManager.js
'DatabaseManager.js' exports 3 functions 'connectDB()', 'getRedirectURL()', 'postNewRedirectURL()'

The function 'connectDB' takes 1 argument that is the object returned by running 'setup()' from default.js
because all the variables like the paths are in that object.

---

The function 'getRedirectURL()' takes 2 argumants and uses a callback for returning the data or the errors produced:
* 1) The object returned by running 'setup()' from default.js
* 2) The int ID of the site that we want to get redirected to.

---

For using the callback you can use:
```Javascript
Object.DatabaseManager.getRedirectURL(Object, 101, (err, rows) => {
	if (err) {
		console.log(err); throw err;
	}
	console.log(rows["URL"]);
});
```

The data returned is a JSON object returning a single field called 'URL'.
If no site can be found with this entry, we simply return 'undefined' and 
it is up to the user would like to hundle it.

---

The function 'postNewRedirectURL()' takes 3 arguments and uses a callback for returning the data or the errors produced:
* 1) The object returned by running 'setup()' from default.js
* 2) The url that is submitted to the api by the user to shorten
* 3) The email of the person that is trying to use the shortener. (No checks happen about the validity of the email.)


#### Database/Files/main.db
For the main database to be compatible with the usecase of our service we need a few settings, it's Create statement is:
```SQL
CREATE TABLE "Links" (
	"ID"	INTEGER UNIQUE,
	"Date"	TEXT NOT NULL,
	"URL"	TEXT NOT NULL,
	"Email_hash"	TEXT NOT NULL,
	"Email_salt"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
);
```
The auto increment is to make a new id on entry automatically without needing for us to search the biggerst one and increment by one.

#### Backups/BackupManager.js

'BackupManager.js' exports 1 functon 'Backup()' that takes only one variable and it is the object that get returned by running 'setup()' from default.js
First thing it does is keep the starting time of the backup and create the directory that has the format of Day_Mon_DD_YYYY_HH_MM_SS and in there it recursively
copies all the directories that are in the 'backupPaths' variable. On finishing it gets the time, subtravts the start times and we get how much time it took to
make the backup as well as the fact that a backup was made in the console that runs the service