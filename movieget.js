//const pg = require('pg');
//const R = require('ramda');
const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'schwinn1',
    port: 5432,
    database: 'movies',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
const express = require('express');
const app = express();
const port = 3002;
var cors = require('cors');
var _ = require('lodash');

hits = 0;       //variable to count number of page hits...
app.use(cors());
app.listen(port, () => console.log(`Movie return app listening on port ${port}!`))

//trying out pooling now...
// we'll create a pool subsequent queries update a local list.
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

function getCurrentList(){
    //only get more db data if hits > 5
    if (hits > 40){
        hits = 0;
        getMyinfo();  //ask for new data, give client current data...
    } 
    else{
        hits += 1;
        return _.sampleSize(resultList, 15)
    }
    //console.log('subset is ###########');
    //x = _.sampleSize(resultList, 5)
    return _.sampleSize(resultList, 15)
}

function convertresults(resultarray){
    resultList = resultarray;
    //console.table(resultList);
    var d = Date(Date.now()); 
    console.log('Retrieved from db at ' + d.toString());
    //return;
} 

resultList = ['empty'];   //local list which our clients will see
//getMovies();
// go read this https://node-postgres.com/features/pooling

function getMyinfo(){

    pool
    .query('SELECT * FROM public.returnsrandom')
    //.query('SELECT * FROM public.movietitles  ORDER BY (random()) limit 50')
    //.then(res => console.log(res.rows))
    .then(res => convertresults(res.rows))
    .catch(err =>
        setImmediate(() => {
        throw err
        })
    )
    
    }

getMyinfo();
//load initial set of data with many records...

/*function trydata(){
    pool
    .query('SELECT * FROM public.movietitles limit 100')
    .then(res => console.log(res.rows))
    //.then(res => convertresults(res.rows))
    .catch(err =>
        setImmediate(() => {
        throw err
        })
    )
    }   */

//trydata();
    // we will send the previously known set, then kickoff a new set query..
app.get('/', (req, res) => res.send(getCurrentList()));



