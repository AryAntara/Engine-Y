export function Say(data,res){
  	return res({
  		output: `${data.params.join(' ')}`,
  		code: 100
  	})
}
