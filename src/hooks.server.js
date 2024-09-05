import { start } from "$lib/server/db/mongo"

start().then(() => {
	console.log('Mongo started')
}).catch(e => {console.error(e)})