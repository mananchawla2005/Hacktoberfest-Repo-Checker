const { Octokit } = require("@octokit/core");
const session = require('express-session');
const parseurl = require('parse-url')
require('dotenv').config()
const octokit = new Octokit({ auth: process.env.TOKEN });
const express = require('express')
const bodyParser = require('body-parser');
const octoberChecker = require('./utils/octoberChecker');
const app = express()
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.get('/', async (req, res)=>{
    if(octoberChecker.isNotOctober()) {
        res.render('not-october')
    }
    else if(app.get('context')=="success"){
    // req.session.context=="idle"
    res.render('index', {show: 'success'})
    app.set('context', 'idle')
    }
    else if(app.get('context')=="failed"){
        res.render('index', {show: 'failed'})
        app.set('context', 'idle')
    }else if(app.get('context')=="pr-accepted"){
        res.render('index', {show: 'pr-accepted'})
        app.set('context', 'idle')
    }else if(app.get('context')=="pr-open"){
        res.render('index', {show: 'pr-open'})
        app.set('context', 'idle')
    }
    else{
        res.render('index', {show: 'idle'})
        app.set('context', 'idle')
    }
})
app.post('/check', async (req, res)=>{
    var owner = parseurl(req.body.repo).pathname.split('/')[1];
    var repository = parseurl(req.body.repo).pathname.split('/')[2];
    var isPrUrl = parseurl(req.body.repo).pathname.includes('pull');
    if(isPrUrl){
        // PR URL
        var prNumber = parseInt(parseurl(req.body.repo).pathname.split('/')[4]);
        try {
            const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                owner: owner,
                repo: repository,
                pull_number: prNumber
            });
            if(response.data.state === 'closed'){
                app.set('context', 'pr-accepted')
                return res.redirect('/')
            }else{
                app.set('context', 'pr-open');
                return res.redirect('/');
            }
        } catch (err) {
            app.set('context', 'pr-open');
            return res.redirect('/');
        }
    }else{
        var isBanned = false;
        try {
            const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
                    owner: owner,
                    repo: repository,
                    sort: 'created',
                    direction: 'asc'
                });
                const issues = response.data;
                issues.forEach(issue => {
                    if(issue.title == "Pull requests here won’t count toward Hacktoberfest."){
                        isBanned = true;
                    }
                });
        } catch (err) {
            app.set('context', 'failed')
            return res.redirect('/')
        }
    
        if(isBanned){
            app.set('context', 'failed')
            return res.redirect('/')
        }else{
            octokit.request('GET /repos/{owner}/{repo}/topics', {
            owner: owner,
            repo: repository,
            mediaType: {
                previews: [
                    'mercy'
                ]
            }
            }).then( x => {
                if(x.data.names.includes('hacktoberfest')){
                    app.set('context', 'success')
                    res.redirect('/')
                }
                else{
                    app.set('context', 'failed')
                    res.redirect('/')
                }
            }).catch(err=>{
                app.set('context', 'failed')
                res.redirect('/')
            });
        }
    }
})
app.get("/api", async (req, res) => {
    if(req.query.url==null) return res.sendStatus(404)
    var owner = parseurl(req.query.url).pathname.split('/')[1];
    var repository = parseurl(req.query.url).pathname.split('/')[2];
    var isPrUrl = parseurl(req.query.url).pathname.includes('pull');
    if(isPrUrl){
        // PR URL
        var prNumber = parseInt(parseurl(req.query.url).pathname.split('/')[4]);
        try {
            const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                owner: owner,
                repo: repository,
                pull_number: prNumber
            });
            const labels = response.data.labels;
            const isHacktoberFestPr = false;
            labels.forEach(label => {
                if(label.name == 'hacktoberfest' || label.name == 'hacktoberfest-accepted'){
                    isHacktoberFestPr = true;
                }
            });
            if(isHacktoberFestPr){
                if(response.data.state === 'closed'){
                    return res.json({
                        "status": "closed"
                    }) 
                }else{
                    return res.json({
                        "status": "open"
                    });
                }
            }else{
                return res.json({
                    "valid": false
                });
            }
        } catch (err) {
            return res.json({
                "status": "open"
            })
        }
    }else{
        var isBanned = false;
        try {
            const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
                    owner: owner,
                    repo: repository,
                    sort: 'created',
                    direction: 'asc'
                });
                const issues = response.data;
                issues.forEach(issue => {
                    if(issue.title == "Pull requests here won’t count toward Hacktoberfest."){
                        isBanned = true;
                    }
                });
        } catch (err) {
            return res.json({
                "valid": false
            })
        }
    
        if(isBanned){
            return res.json({
                "valid": false
            })
        }else{
            octokit.request('GET /repos/{owner}/{repo}/topics', {
            owner: owner,
            repo: repository,
            mediaType: {
                previews: [
                    'mercy'
                ]
            }
            }).then( x => {
                if(x.data.names.includes('hacktoberfest')){
                    return res.json({
                        "valid": true
                    })
                }
                else{
                    return res.json({
                        "valid": false
                    })
                }
            }).catch(err=>{
                return res.json({
                    "valid": false
                })
            });
        }
    }
    // res.json(["Tony","Lisa","Michael","Ginger","Food", req.query.url]);
});
app.use(express.static(__dirname + '/public'));
app.listen(8080, ()=>console.log('Listening on port 8080'))




