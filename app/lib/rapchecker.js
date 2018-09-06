const ROBLOX = require('./roblox.js')
const request = require('phin').promisified

const RAP_API = (id, asset, cursor) => `https://inventory.roblox.com/v1/users/${id}/assets/collectibles?assetType=${asset}&sortOrder=Asc&limit=100&cursor=${cursor}`

const assetTypes = ['Hat', 'Gear', 'Face', 'HairAccessory', 'FaceAccessory', 'NeckAccessory', 'ShoulderAccessory', 'FrontAccessory', 'BackAccessory', 'WaistAccessory']

class RAPChecker extends ROBLOX {
    constructor(account) {
        super(account)
        this.RAP = 0
        this.start = Date.now()
    }

    async getRAPforAssetType(asset, cursor = "") {
        const API = await request({
            url: RAP_API(this.id, asset, cursor),
            method: 'GET',
            parse: 'json'
        })
        let i = API.body.data.length
        while (i--)
            this.RAP += Number(API.body.data[i].recentAveragePrice) || 0
        if (API.body.nextPageCursor)
            return this.getRAPforAssetType(asset, API.body.nextPageCursor)
    }

    async getRAP() {
        await this.id
        let requests = []
        for (let asset of assetTypes)
            requests.push(this.getRAPforAssetType(asset))
        await Promise.all(requests)
        return {
            RAP: this.RAP, 
            query: this.username || this.id, 
            time: (Date.now() - this.start) / 1000
        }
    }
}

module.exports = RAPChecker