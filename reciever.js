import express from 'express';
import {Jack,standardResponse} from "./command.js";

const app = express();
app.use(express.json())

app.post('/bot',async (req,res) => {

	// tell kernel to handle this message
	if(!req.body.message){
		res.json(standardResponse({
			code: 404,
			message: 'You Not Provided Any Command',
			output:''
		}))
		return res.end()
	}
	
	Jack.process(req.body.message)
	let processed = await Jack.execute()
	res.json(processed)
	return res.end()
})

app.listen(8888,() => {
	console.log('Bot Reciever Run on port',8888)	
})
