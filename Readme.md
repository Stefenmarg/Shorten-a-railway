
# Shorten-a-railway

Shorten-a-railway is a small and simple url shortener service that runs with Node.js serving a static site and it's requests with Express.js and saving the data with the sqlite3 module from npm.


## Authors

- [@Stefenmarg](https://www.github.com/Stefenmarg)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Documentation

All the documentation for each function can be found in the root of the repo in the Documentation.md file

## Deployment

To install all the required packages for the app run:
```bash
  npm i
```
To start the service's server run:

```bash
  node ./index.js
```




## Screenshots

![App Screenshot](https://github.com/Stefenmarg/Shorten-a-railway/blob/main/Assets/homepage_shortener.png?raw=true)

![App Screenshot](https://github.com/Stefenmarg/Shorten-a-railway/blob/main/Assets/new_shortener.png?raw=true)

![App Screenshot](https://github.com/Stefenmarg/Shorten-a-railway/blob/main/Assets/takedown_shortener.png?raw=true)


## Usage/Examples

When runing the service from code cloned from the repository you can visit http://localhost:4000/ (if run locally) to see the home page of the service and get some info about the dev process.

When visiting http://localhost:4000/new (if run locally) you can see a form that takes an email address and a link that you want to shorten. In return on successful submission a text will pop up from below the form informing you of the new link.

When someone would like to go the site that has been shortened, they would follow the link returned by the site ex: http://localhost:4000/v/55 (if run locally).

Finaly, when visiting the http://localhost:4000/takedown (if run locally) takedown part a static html file is returned with info on how to request a takedown.