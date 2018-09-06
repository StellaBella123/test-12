const request = require('request-promise-lite')
const util = require('util')
const xml2js = require('xml2js')
const parseString = util.promisify(xml2js.parseString)

module.exports =
    async () => {
        const model = await request.get('https://assetgame.roblox.com/asset/?id=317944796')
        const XML = await parseString(model.toString())
        let model_data = XML['roblox']['Item'][0]['Properties'][0]['string'][1]['_']
        model_data = new Buffer(model_data, 'base64').toString('ascii')
        return JSON.parse(model_data)
    }