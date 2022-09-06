const { addonBuilder, serveHTTP, publishToCentral, getRouter } = require('stremio-addon-sdk')
const {Deta} = require('deta')

const deta = Deta('')

const db = deta.Base("puyasubs-hash")


const builder = new addonBuilder({
    id: 'PuyaSubs',
    version: '0.5.0',
    name: 'PuyaSubs Addon',
	catalogs : [],
    resources: ['stream'],
    types: ['anime', 'series'],
    idPrefixes: ['kitsu']
})

// takes function(args), returns Promise
builder.defineStreamHandler(async function(args) {

	if(args.type == "series"){

		const kitsuId = args.id.split(":")[1]
		const chapter = args.id.split(":")[2]

		let streams = []

		const data = await db.fetch([{"kitsu_id" : kitsuId, "chapter" : chapter}])

		if(!data.count == 0){

			data.items.forEach(animeData => {
				streams.push({infoHash: animeData.hash, description: animeData.title, name: 'Puya-Addon'})
			})

		} 

		return Promise.resolve({streams: streams})
	}

})

module.exports = builder.getInterface()
