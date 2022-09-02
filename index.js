#!/usr/bin/env node

const { addonBuilder, serveHTTP, publishToCentral } = require('stremio-addon-sdk')
const {Deta} = require('deta')

const deta = Deta('')

const db = deta.Base("puyasubs-hash")

const builder = new addonBuilder({
    id: 'org.myexampleaddon',
    version: '1.0.0',

    name: 'simple example',

    // Properties that determine when Stremio picks this addon
    // this means your addon will be used for streams of the type movie
	catalogs : [],
    resources: ['stream'],
    types: ['anime', 'movie', 'series'],
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

			return Promise.resolve({streams: streams})
		} else {

		return Promise.resolve({ streams: streams })

		}

	}

})

serveHTTP(builder.getInterface(), { port: 7000 })

// If you want this addon to appear in the addon catalogs, call .publishToCentral() with the publically available URL to your manifest
//publishToCentral('https://my-addon.com/manifest.json')
//
