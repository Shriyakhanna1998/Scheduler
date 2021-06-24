const express = require('express')
const path = require('path')
const publicDir = path.join(__dirname, '../public')
const app = express()
app.use(express.static(publicDir))
const teacherRouter = require('./routers/teacher')
const slotRouter = require('./routers/slot')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
 	extended: true
}))
app.use(slotRouter)
app.use(teacherRouter)

app.get('/', (request, response) => {
	response.render('index.html', { 
		cssPath: cssPath,
		jsPath: jsPath
	})
})
app.listen(5000, () => {
	console.log('server is running at port 5000')
})