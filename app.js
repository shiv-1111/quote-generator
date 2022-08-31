const fs = require('fs')
const express = require('express')
const cookieParser = require('cookie-parser') 
const app = express()
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json())
app.use(cookieParser())



app.get('/',(req,res)=>{ 
    if(req.cookies.loginData != undefined) {
        let userData = fs.readFileSync(`db/${req.cookies.loginData.Username}.txt`,'utf-8');
        userData = JSON.parse(userData)
        console.log('file read')
        if (req.cookies.loginData.Passkey == userData.password && req.cookies.loginData.Username == userData.username)
        {res.sendFile('views/dashboard.html',{root:__dirname})}
    }
    else {res.sendFile('views/index.html',{root:__dirname})}
    
})

app.post('/signup',(req,res)=>{
    console.log(req.body);
    fs.writeFile(`db/${req.body.username}.txt`,JSON.stringify(req.body),(err)=>console.log('user data added'))
    let userCookie = {Username:req.body.username,Passkey:req.body.password}
    res.cookie('loginData',userCookie);
    res.sendFile('views/dashboard.html',{root:__dirname});
})

app.post('/login',(req,res)=>{
    console.log('login tried')
    let loginData = fs.readFileSync(`db/${req.body.username}.txt`,'utf-8');
    loginData = JSON.parse(loginData);
    if(req.body.username == loginData.username && req.body.password == loginData.password){
        res.sendFile('views/dashboard.html',{root:__dirname});
    }
    else if(req.body.username != loginData.username || req.body.password != loginData.password){
        res.send("Username / Password doesn't match. Please try again")
    }
    else
    {
        res.send('Login failed. Please signup / Go to the Login page to try again')
        // res.sendFile('views/index.html',{root:__dirname});
    }
})

    app.get('/logout',(req,res)=>{
        res.clearCookie('loginData');
        res.sendFile('views/index.html',{root:__dirname})
    })

app.listen(3000,()=>console.log("Port started at 3000"))