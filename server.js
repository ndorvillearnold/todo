const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2122
require('dotenv').config()

//db would mean the mongo DB database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }).catch(err => { console.log(err) })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//db would mean the mongo DB database
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //went to do documents and put all thre in array holding all documents / objects and pass to PARAMS=data
    db.collection('todos').find().sort({ completed: -1, id: 1 }).toArray()
        .then(data => {  //data here is the array holding the data (objects in collection)
            db.collection('todos').countDocuments({ completed: false })
                .then(itemsLeft => {
                    //now pass objects into template(EJS)- i have given it a name called (items) because its after:(colon) ( made it key value pair "item:data")
                    //if in EJS template and you see "item" it will be the array of items so "items: data"  is key value pair. (thing)/items could of been names anything
                    response.render('index.ejs', { items: data, left: itemsLeft })  //so itemsLeft = the objects that are completed:false

                })
        })
        .catch(error => console.error(error))
})


//After post and refreshes it makes a get request and API responds with OK/200
//API code listens app.get is a different smurf and respond 
//we put it in template (EJS) and render it in browser
app.post('/addTodo', (request, response) => {
    //console.log(request.body)
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

//  /markcomplete is the route
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

//....itemFromJS is what we entered in the FORM
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))


})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})