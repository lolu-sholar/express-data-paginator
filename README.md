# ExpressJs App Paginator

A paginator middleware for express.js applications.
It can also be easily modified to work with Nest.js applications.





### Description

The paginator activates on detection of two request query variables namely:

- `pageNumber` - The page number to return

- `pageLimit` - The maximum number of records per page

The paginator:

- Reads the values from the query variables e.g. `?pageNumber=1&pageLimit=10`

- Checks the response data for a `data` key e.g. `{ data: [1,2,3,4,5] }`, if an object, but uses the response data as default if no `data` key is found.

- Paginates the data based on the values passed

- Calculates the total number of pages

- Returns an object that contains `data` and `pages` fields e.g. `{ data: [1,2,3,4,5], pages: 2 }`





### How to include the paginator in your project

Copy the `paginator.js` file from this project's `app/middleware` folder into your own destination folder e.g. `middlewares/paginator.js` and include like tihis:

```js
const express = require('express')
const SyntaxeIO = require('syntaxe-express')
const router = require('./app/router')

const paginator = require('./middlewares/paginator')

const app = express()

// Add paginator middleware
app.use(paginator())

// Add syntaxe middleware (optional)
SyntaxeIO.init({
    enabled: true,
    app
})

// Attach router to app
router.sync(app)

const port = 4000
app.listen(port, () => console.log(`App listening on ${port}`))
```



 

### The Paginator

```js
const url = require('url');

// Define paginator object
const pageInfo = {
	no: null,
	limit: null,
	requestUrl: null,
	requestId: null,
	active: false
}

module.exports = () => {
	return async(req, res, next) => {
		try {
		  // Get query parameters
		  [pageInfo.no, pageInfo.limit] = [Number(req.query?.pageNumber), Number(req.query?.pageLimit)]
		  // Check if active
		  pageInfo.active = pageInfo.no > 0 && pageInfo.limit > 0
		  // Get request url
		  pageInfo.requestUrl = url.parse(req.url, true)
		  // Get request id
		  pageInfo.requestId = String(pageInfo.requestUrl.pathname.substr(1)).replace(/[^\w]+/g, '-')

		  // Check if paginator is active
		  if (pageInfo.active) {
			  // Grab object send function
			  const originalSend = res.send
			  // Hook to new send function
			  res.send = function (response) {
			  	// Get response data
			  	let responseObject = JSON.parse(response),
			  			dataObject = responseObject?.data ?? responseObject

			  	// Check if array
			  	if (Array.isArray(dataObject)) {
			  		// Define start and end
			  		const start = (pageInfo.no * pageInfo.limit) - pageInfo.limit,
			  				end = start + pageInfo.limit

			  		// Adjust response result
			  		const finalForm = {
			  			data: dataObject.slice(start, end),
			  			pages: Math.ceil(dataObject.length / pageInfo.limit)
			  		}

			  		// Stringify response
			  		response = JSON.stringify(finalForm)
			  	}
			  	
			  	originalSend.call(res, response)
			  }
			}
		} catch(err) {
			console.error('Error setting up paginator', err)
		}

  	next()
  }
}
```





### Demo

[Check out the demo on Vercel](https://express-data-paginator.vercel.app/)





### About Syntaxe-Express (sidebar)

Syntaxe-express is a middleware based on the syntaxe declarative data fetching engine.

You can find out more about it [here](https://github.com/SyntaxeQL/syntaxe-express). 





### Endpoints

The following endpoints are available in the application on Vercel.

- [App Users (Page 1 / 10 records per page)](https://express-data-paginator.vercel.app/api/app-users?pageNumber=1&pageLimit=10)

- [GitHub Users (Page 1 / 5 records per page)](https://express-data-paginator.vercel.app/api/github-users?pageNumber=1&pageLimit=5)

- [Countries (Page 3 / 5 records per page)](https://express-data-paginator.vercel.app/api/countries?pageNumber=3&pageLimit=5)

- [Countries & States (Page 2 / 4 records per page)](https://express-data-paginator.vercel.app/api/countries-states?pageNumber=2&pageLimit=4)

- [Countries, States & Cities (Page 5 / 5 records per page)](https://express-data-paginator.vercel.app/api/countries-states-cities?pageNumber=5&pageLimit=5)





### Sample Request

```js
// Return page 1 with each page containing 10 records
fetch('https://express-data-paginator.vercel.app/api/app-users?pageNumber=1&pageLimit=10', {
    method: 'GET'
})
.then(response => response.json())
.then(console.log)

```