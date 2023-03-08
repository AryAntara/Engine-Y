export const prefix = (data,next) => {
	if(data.message[0] != '/'){
		return 'Not a Command'
	}
	data.handler = data.message.split(' ')[0].slice(1)
	return next(data,next)
}
export const parseParams = (data,next) => {
	data.params = data.message.split(' ').slice(1)
	return next(data,next)
}
