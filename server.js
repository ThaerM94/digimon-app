'use strict';
require('dotenv').config();
const express = require('express')
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
/////main\\\\\
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;

/////uses\\\\\\
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

//////------(routs)------\\\\\
app.get('/',homeHandelr)
app.get('/fav',addToFavouHandelr);
app.get('saveToDBHandelr',saveToDBHandelr)
app.get('/details/:digimon.id',editHandelr)
app.put('/update/:digimon.id',updatHandelr);
app.delete('/delete/:digimon.id',deleteHandelr)

app.get('*',notFoundHandler);
//////------(handelrs)------\\\\
///homeHandelr\\\
function homeHandelr (req,res){
    
    let url = `https://digimon-api.herokuapp.com/api/digimon`;
    let {name,image,level}=req.body
    // console.log(req.body);
    superagent.get(url)
    .then(data=>{
        // console.log(data);
        
        let arrDigimon = data.body.map(val=>{
            console.log(arrDigimon);
            
            return new Digimon(val);
        })
        res.render('/',{data:arrDigimon});
    }) .catch((error)=>{
        errorHandelr(error,req,res);
    })
}

function Digimon (value){
    this.name = value.name;
    this.image = value.body.img;
    this.level = value.body.level;
}

////addToFavouHandelr\\\
function addToFavouHandelr (req,res){
    let sql = 'SELECT * FROM heros ;';
    client.query(sql)
    .then(result=>{
        res.render('./favourit.ejs',{data:result.rows});
    })
}


/////saveToDBHandelr\\\\

function saveToDBHandelr (req,res){
    let {name,image,level}= req.query;
    let sql = 'INSERT INTO heros (name,image,level) VALUES ($1,$2,$3);';
    let safeValues = [name,image,level];
    client.query(sql,safeValues)
    .then(()=>{
        res.redirect('/fav')
    })

}

/////editHandelr\\\\\


//////updatHandelr\\\\\
function updatHandelr(req,res){
    let {name,image,level} = req.body;
    let params = req.params.digimon.id;
    let sql = 'UPDATE heros SET name=$1, image=$2, level=$3 WHERE id=$4;';
    let safeValues = [name,image,level];
    client.query(sql,safeValues)
    .then(()=>{
        res.render(`./details/${params}`)
    })
}

////deleteHandelr\\\\
function deleteHandelr(req,res){
    let {name,image,level} = req.body;
    let params = req.params.digimon.id;
    let sql = 'DELETE FROM heros name=$1, image=$2, level=$3 WHERE id=$4;';
    let safeValues = [name,image,level];
    client.query(sql,safeValues)
    .then(()=>{
        res.render(`./details/${params}`)
    })
}


/////client listening\\\\\
client.connect()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`im listen on ${PORT}`);
        
    })
})

/////errorhand\\\\\
function notFoundHandler (req,res){
    res.status(404).send('page not found');
}

function errorHandelr (error,req,res){
    res.status(500).send(error)
}