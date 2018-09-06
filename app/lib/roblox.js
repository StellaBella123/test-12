const request = require('phin').promisified
const cheerio = require('cheerio')
const moment = require('moment')

class ROBLOX {
    constructor(account) {
        this.username = account.username
        this.id = account.id || this.setIdFromUsername()
    }

    async getJoinDate() {
        await this.id
        const profile = await request({
            url: `https://www.roblox.com/users/${this.id}/profile`,
            method: 'GET',
            parse: 'none'
        })
        const $ = cheerio.load(profile.body)
        const joinDate = $('.profile-stat').first().find('.text-lead').text()
        return {
            joinDate: joinDate,
            days: moment().diff(moment(joinDate, 'MM/DD/YYYY'), 'days')
        }
    }

    async getPreviousUsernames() {
        await this.id
        const profile = await request({
            url: `https://www.roblox.com/users/${this.id}/profile`,
            method: 'GET',
            parse: 'none'
        })
        const $ = cheerio.load(profile.body)
        const previousNames = $('.tooltip-pastnames')
        let names = []
        if (previousNames.length > 0)
            names = previousNames.attr('title').split(', ')
        names.unshift($('.header-title').find('h2').text())
        return names
    }

    async setIdFromUsername() {
        const req = await request({
            url: 'https://api.roblox.com/users/get-by-username?username=' + encodeURI(this.username),
            method: 'GET',
            parse: 'json'
        })
        if (!req.body.Id) throw new Error('Failure getting username from Id')
        this.username = req.body.Username
        return this.id = req.body.Id
    }
}

module.exports = ROBLOX