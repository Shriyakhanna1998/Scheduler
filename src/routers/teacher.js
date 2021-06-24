const connection = require('../utils/dbconnect.js')
const http = require('http')
const express = require('express')
const router = express.Router()

router.get('/all/teacher', (req, res) => {
	connection.query("SELECT * FROM teacher", (error, result, field) => {
		if (error){
			return res.json({
				error: error.sqlMessage
			})
		}
		res.json({
			result
		})
	})
})
router.get('/teacher/:id', (req,res) => {
	const teacher_id = req.params.id
	connection.query("SELECT name FROM teacher WHERE ID = " + teacher_id, (error, result, field) => {
		if (error){
			return res.json({
				error: error
			})
		}
		res.json({
			name: result[0].name
		})

	})
})
router.post('/add/teacher', (req, res) => {
	const name = req.body.name
	connection.query(`INSERT INTO teacher(name) VALUES("${name}")`, (error, result, field) => {
		if (error) {
			return res.json({
				error: error.sqlMessage
			})
		}
		res.json({
			affectedRows: result.affectedRows
		})
	})
})
router.patch('/update/teacher/:id', (req, res) =>{
	const id = req.params.id
	const rename = req.body.name
	connection.query(`UPDATE teacher SET name='${rename}' WHERE ID=${id}`,(error, result, field) =>{
		if(error){
			return res.json({
				error: error.sqlMessage
			})
		}
		res.json({
			affectedRows: result.affectedRows
		})
	})
})
router.delete('/delete/:id', (req, res) =>{
	const id = req.params.id
	const options = {
		host: 'localhost',
		port: '5000',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		path: '/delete/slot/' + id,
		method: 'DELETE'
	}
	const httpRequest = http.request(options, (httpRes) => {
		httpRes.on('data', (data) => {
			connection.query(`DELETE FROM teacher WHERE ID=${id}`, (error, result, field) =>{
				if(error){
					return res.json({
						error: error.sqlMessage
					})
				}
				res.json({
					affectedRows: result.affectedRows
				})
			})
		})
	})
	httpRequest.on('error', (error) => {
		res.json({
			error : error
		})
	})
	httpRequest.end()
	
})
module.exports = router