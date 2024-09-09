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

	deleteExpiredSessionsJob()
}

function deleteExpiredSessionsJob() {
	// run once every 10 minutes
	setInterval(() => {
		const now = new Date()
		userCollection.updateMany(
            { 'sessions.expires': { $lt: now } },
            { $pull: { 'sessions': { expires: { $lt: now } } } }
        ).catch(e => console.error(`mongo.js deleteExpiredSessionsJob() ${e}`))
	}, 600000);
}

process.on('SIGINT', () => {
	client.close().catch(e => console.error(`mongo.js client.close() ${e}`))
});
