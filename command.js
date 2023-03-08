import {Engine} from "./core/kernel.js"
import {prefix,parseParams} from "./middleware.js"
import {Say} from "./Controller/say.js"

// create Kernel instance
export const Jack = new Engine()
export const standardResponse = Jack.responseDefault

// regist a middleware
Jack.use(prefix)
Jack.use(parseParams)

//handler
Jack.setHandler('say',Say)

// test 
Jack.process('Andi')
await Jack.execute()
