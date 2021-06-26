const connection = require('../utils/dbconnect.js')
const express = require('express')
const router = express.Router()

router.get('/slot/:id',(req,res) => {
	const id = req.params.id
	connection.query("SELECT * FROM slot INNER JOIN teacher ON slot.TEACHER_ID = teacher.ID WHERE slot.TEACHER_ID ="+ id, (error, results, field) =>{
		if (error){
			res.json({
				error: error
			})
		}
		res.json(results)
	})
})
router.get('/get-slot/:sid',(req,res) => {
	const id = req.params.sid
	connection.query("SELECT * FROM slot WHERE SID ="+ id, (error, results, field) =>{
		if (error){
			res.json({
				error: error
			})
		}
		res.json(results)
	})
})

router.post('/slot/schedule', (req, res) => {
	const from = req.body.from_time
	const to = req.body.to_time
	const task = req.body.task
	const id = req.body.teacher_id
	connection.query(`INSERT INTO slot(from_time, to_time, task, TEACHER_ID) VALUES('${from}', '${to}', '${task}', ${id})`, (error, result, field) =>{
		if (error){
			return res.json({
				error: error.sqlMessage
			})
		}
		res.json({
			affectRows: result.affectedRows,
			sid: result.insertId
		})
	})
})
router.patch('/update/slot/:id', (req, res) =>{
	const id = req.params.id
	const retask = req.body.task
	const start = req.body.from_time
	const finish = req.body.to_time
	connection.query(`UPDATE slot SET task='${retask}', from_time='${start}', to_time='${finish}' WHERE TEACHER_ID=${id}`,(error, result, field) =>{
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

router.delete('/delete/teacher_slot/:id', (req, res) =>{
	const id = req.params.id
	connection.query(`DELETE FROM slot WHERE TEACHER_ID=${id}`, (error, result, field) =>{
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

router.delete('/delete/slot/:sid', (req, res) =>{
	const sid = req.params.sid
	connection.query(`DELETE FROM slot WHERE SID=${sid}`, (error, result, field) =>{
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

router.get('/validate/slot/:teacher_id/:from/:to', (req, res) =>{
	const id = req.params.teacher_id
	const from = req.params.from
	const to = req.params.to
	connection.query(`SELECT TEACHER_ID FROM slot WHERE (UNIX_TIMESTAMP(from_time) BETWEEN UNIX_TIMESTAMP('${from}') AND UNIX_TIMESTAMP('${to}')) AND (UNIX_TIMESTAMP(from_time) <> UNIX_TIMESTAMP('${to}')) OR (UNIX_TIMESTAMP(to_time) BETWEEN UNIX_TIMESTAMP('${from}') AND UNIX_TIMESTAMP('${to}')) AND (UNIX_TIMESTAMP(to_time) <> UNIX_TIMESTAMP('${from}'))`, (error, result, field) =>{
		if(error){
			return res.json({
				error: error.sqlMessage
			})
		}
		res.json({
			result
		})
	})
})
module.exports = router