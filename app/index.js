// Modules
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const apicache = require('apicache')
const path = require('path')

// Classes
const ROBLOX = require('./lib/roblox')
const RAPChecker = require('./lib/rapchecker')
const getLatestItems = require('./lib/getlatestitems')

// App modules
app.use(apicache.middleware('1 minutes'))

const validateQuery = (req, res, next) => {
    const username = req.query.username
    const userId = Number(req.query.userId)
    if (!userId && !username) {
        return res.json({error: true, message: 'Must provide a valid userId (int) or alternatively a username (str).'})
    } else {
        next()
    }
}

app.get('/api/rap', validateQuery, async (req, res, next) => {
    try {
        const RAP_data = await new RAPChecker({
            username: req.query.username, 
            id: req.query.userId
        }).getRAP()
        res.json({data: RAP_data})
    } 
    catch (err) {
        next(new Error(err))
    }
})

app.get('/api/usernames', validateQuery, async (req, res, next) => {
    try {
        const previousNames = await new ROBLOX({
            username: req.query.username, 
            id: req.query.userId
        }).getPreviousUsernames()
        res.json({data: previousNames})
    } 
    catch (err) {
        next(new Error(err))
    }
})

app.get('/api/joindate', validateQuery, async (req, res, next) => {
    try {
        const joinDate = await new ROBLOX({
            username: req.query.username, 
            id: req.query.userId
        }).getJoinDate()
        res.json({data: joinDate})
    } 
    catch (err) {
        next(new Error(err))
    }
})

app.get('/api/latestitems', async (req, res, next) => {
    try {
        res.json(await getLatestItems())
    } 
    catch (err) {
        next(new Error(err))
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: true, message: 'Internal server error'})
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})
