class Kernel {

	message = '';

	/**
	 *
	 * @param {@import('express').Request.body} message
	 *
	 */
	process(message){
		this.message = message;
	}
	
}

class Handler extends Kernel {
	handlers = {};
	async handler(command){
		if(!command.data){
			return command
		}
		command.handler = command.data.handler ? command.data.handler : command.handler
		delete command.data._middleware_id
		delete command.data.handler
		let lastData = this.handlers[command.handler] ? await this.handlers[command.handler](command.data,this.responseDefault) : 'No Handler Found'

		if(lastData === 'No Handler Found'){
			let errorOutput = {}
			errorOutput.output = lastData
			errorOutput.code = 'Engine-Y-500'
			errorOutput.message = 'Cannot Find Specific Handler'
			lastData = errorOutput
		} else if(!lastData?.code || !lastData?.message){
			throw new Error(`Please Provide a Standard Ouput for Handler, handler name '${command.handler}'`)
		}
		
		return lastData
	}
	
	setHandler(command,func){
		return this.handlers[command] = func
	}	

	responseDefault(overWrite){
		let response = {}
		response.output = overWrite?.output != undefined ? overWrite.output : ''
		response.code = overWrite?.code != undefined && !isNaN(Number(overWrite.code))? `Engine-y-${overWrite.code}` : 'Engine-y-200'
		response.message = overWrite?.message != undefined ? overWrite.message :'OKE'
		return response
	}
}

class Middleware extends Handler {
	middlewares = [];
	use(middleware){
		this.middlewares.push(middleware)
	}
	
	execute(){
		// next function
		const next = (param,self) => {
			const nextMidleware_id = param._middleware_id+1
			const data = param
			data._middleware_id = nextMidleware_id
			return this.middlewares[nextMidleware_id] ? this.middlewares[param._middleware_id](data,self) : {word: param.message, data: param}
		}
		// data 
		const data = {
			_middleware_id : 0,
			message : this.message
		}
		return this.handler(this.middlewares[data._middleware_id](data,next))
	}	
}

class Test extends Middleware {
	async handler(command){
		if(!command.data){
			return command
		}
		command.handler = command.data.handler ? command.data.handler : command.handler
		delete command.data._middleware_id
		delete command.data.handler
		let lastData = this.handlers[command.handler] ? await this.handlers[command.handler](command.data,this.responseDefault) : 'No Handler Found'

		if(lastData === 'No Handler Found'){
			let errorOutput = {}
			errorOutput.output = lastData
			errorOutput.code = 'Engine-Y-500'
			errorOutput.message = 'Cannot Find Specific Handler'
			lastData = errorOutput
		} else if(!lastData?.code || !lastData?.message){
			console.log({
				Error : `Please Provide a Standard Ouput for Handler, handler name '${command.handler}'`,
				Reason : `You not return res() or you not setup the second parameter`
			})
			return 'This A Test'
		}
		
		console.log({
			Success: lastData,
			
		})
		return 'This A Test'
	}
}

export class Engine extends Middleware {}
export class EngineDev extends Test {}
