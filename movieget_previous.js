const pg = require('pg');
//const R = require('ramda');
const express = require('express');
const app = express();
const port = 3002;
var cors = require('cors');

app.use(cors());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const cs = 'postgres://postgres:schwinn1@localhost:5432/movies';
//const client = new pg.Client(cs);
//client = new pg.Client(cs);


resultList = [];
getMovies();

function getCurrentList(){
    getMovies();
    return resultList;
}

function convertresults(resultarray){
    resultList = resultarray;
    console.table(resultList);
    //return;
}


// go read this https://node-postgres.com/features/pooling

async function getMovies(){
    client = new pg.Client(cs);
    client.connect()
    .then(() => console.log("Connected successfuly"))
    //.then(() => client.query("select * from employees where name = $1", ["Edmond"]))
    .then( () => client.query('SELECT * FROM public.returnsrandom'))
    //.then(results => console.table(results.rows))
    .then(results => convertresults(results.rows))
    .catch(e => console.log(e))
    .finally(() => client.end())

    return resultList;
}

/*  old 
client.query('SELECT * FROM public.returnsrandom').then(res => {
//const result = R.head(R.values(R.head(res.rows)));
//var marko = JSON.parse(res.rows);
var i;
for (i = 0; i < res.rows.length; i++) {
    //finalSendString = finalSendString + '<a href='
    finalSendString = finalSendString + "\"" + res.rows[i]['test'] + "\"" + ','; //'>'
    //finalSendString = finalSendString + res.rows[i]['test'] + '</a>'
    console.log(finalSendString);
    }
finalSendString.substring(0, finalSendString.length - 2);
finalSendString = finalSendString + '}'; //<br>';
}).finally(() => client.end());
*/   //end old

// we will send the previously known set, then kickoff a new set query..
app.get('/', (req, res) => res.send(getCurrentList()));



