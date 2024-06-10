const express = require('express')
const SyntaxeIO = require('syntaxe-express')
const router = require('./app/module/router')
const paginator = require('./app/middleware/paginator')

const app = express()

// Add paginator middleware
app.use(paginator())

// Add syntaxe middleware
SyntaxeIO.init({
	enabled: true,
	app
})

// Attach router to app
router.sync(app)

const port = 4000
app.listen(port, () => console.log(`App listening on ${port}`))

module.exports = app