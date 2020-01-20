const {Client} = require('pg')
const client = new Client({
    user: "postgres",
    password: "schwinn1",
    host: "localhost",
    port: 5432,
    database: "movies"
})

client.connect()
.then(() => console.log("Connected successfuly"))
//.then(() => client.query("select * from employees where name = $1", ["Edmond"]))
.then( () => client.query('SELECT * FROM public.returnsrandom'))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end())