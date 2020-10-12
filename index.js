const { Octokit } = require("@octokit/core");
const session = require('express-session');
const parseurl = require('parse-url')
require('dotenv').config()
const octokit = new Octokit({ auth: process.env.TOKEN });
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.get('/', async (req, res)=>{
    if(app.get('context')=="success"){
    // req.session.context=="idle"
    res.render('index', {show: 'success'})
    app.set('context', 'idle')
    }
    else if(app.get('context')=="failed"){
        res.render('index', {show: 'failed'})
        app.set('context', 'idle')


    }
    else{
        res.render('index', {show: 'idle'})
        app.set('context', 'idle')

    }

})
app.post('/check', async (req, res)=>{
    var owner = parseurl(req.body.repo).pathname.split('/')[1];
    var repository = parseurl(req.body.repo).pathname.split('/')[2]
    octokit.request('GET /repos/{owner}/{repo}/topics', {
        owner: owner,
        repo: repository,
        mediaType: {
          previews: [
            'mercy'
          ]
        }
      }).then(x=>{
        if(x.data.names.includes('hacktoberfest')){
            app.set('context', 'success')
            res.redirect('/')
        }
        else{
            app.set('context', 'failed')
            res.redirect('/')
        }

    }
    ).catch(err=>{
        app.set('context', 'failed')
        res.redirect('/')
    })
    

})
app.use(express.static(__dirname + '/public'));
app.listen(8080, ()=>console.log('Listening on port 8080'))




