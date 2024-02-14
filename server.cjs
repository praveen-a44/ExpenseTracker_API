const express =require('express')
const bodyparser=require('body-parser')
const{connectToDb,getDb}=require('./dbConnect.cjs') //importing connectToDb,getDb functions from dbConnect.cjs
const { ObjectId } = require('mongodb')
const cors =require('cors')

const app= express()
app.use(cors())
app.use(bodyparser.json())

let db 
connectToDb(function(error){  //callback function
        if(error){
            console.log('Could not establish connection...')
            console.log(error)

        } else {
            const port=process.env.PORT || 8000
            app.listen (port)
            db = getDb()
            console.log('Listening on port 8000...')
        }

})

/**
 * Expense Tracker
 * Functionalities : adding entry, getting the summaries of previous entries, editing and deleting
 * Input fields : Category, Amount, Date
 * 
 * CRUD : Create, Read, Update and Delete
 * 
 * get-entries / get-data - GET
 * add-entry - POST
 * edit-entry - PATCH
 * delete-entry - DELETE
 */

app.post('/add-entry', function(request, response) {
    db.collection('ExpensesData').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})

app.get('/get-entry',function(request,response){
    const entries=[]
    db.collection('ExpensesData').find()
    .forEach(entry =>entries.push(entry))
    .then(function(){
        response.json(entries)
    }).catch(function(){
        response.status(500).json({
            "status":"Could not fetch document"
        })
    })
})

app.delete('/delete-entry',function(request,response){
   if(ObjectId.isValid(request.query.id)){

    db.collection("ExpensesData").deleteOne({
        
        _id: new ObjectId(request.query.id)
        
        }).then(function(){
            response.status(200).json({"status":"Entry successfully deleted"})
        }).catch(function(){
            response.status(500).json({"status":"Entry not deleted"})
        })
   }
   else{
    response.status(500).json({"Status":"query is not valid"})
   }
})

app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('ExpensesData').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})


