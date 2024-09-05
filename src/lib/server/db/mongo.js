import { MongoClient } from "mongodb"
import { MONGO_URL, ROOT_USERNAME, ROOT_PASSWORD } from '$env/static/private'
import { hashSync } from "bcrypt"

const client = new MongoClient(MONGO_URL)
const dbName = 'Scoresheet-Updater'

export const userCollection = client.db(dbName).collection('User')
export const settingsCollection = client.db(dbName).collection('Settings')

export async function start() {
	console.log('Starting mongo...')
	await client.connect()

	// create index to auto delete old sessions
	userCollection.createIndex( { "sessions.expires": 1 }, { expireAfterSeconds: 0 } )

	// insert root user
	const rootUser = {
		_id: ROOT_USERNAME,
		passwordHash: hashSync(ROOT_PASSWORD, 10),
		spreadsheetId: '',
		sessions: []
	}
	userCollection.updateOne(
		{ _id: ROOT_USERNAME },
		{ $setOnInsert: rootUser}, // only insert if not exists
		{ upsert: true }
	).catch(e => console.error(`error adding root user to db ${e}`))

	// insert settings
	const settings = {
		_id: 'settings',
		canCreateAccounts: true
	}
	settingsCollection.updateOne(
		{ _id: 'settings' },
		{ $setOnInsert: settings}, // only insert if not exists
		{ upsert: true }
	).catch(e => console.error(`error adding settings to db ${e}`))
}

process.on('SIGINT', function(params) {
	client.close()
});
