// Importing firebase libraries
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Importing the faunadb library
const faunadb = require("faunadb");

const express = require("express");
const cors = require("cors");
const app = express()

app.use(cors())

const {
    Get,
    Ref,
    Update,
    Collection,
    Create,
    Delete,
    Documents,
    Paginate,
    Map,
    Lambda,
} = faunadb.query;

const client = new faunadb.Client({
	secret: 'fnAELPexSRACB-sPSri_3VIg71XDPNzj9ML-jSH4'
})

// API endpoint for reading all documents in a collection
app.get('/read', async(req, res) => {
    const doc = await client.query(
        // Map iterates over the array and executes the lambda defined on every element
        Map(
            // Paginate takes all the items in the collection and returns a page of results
            Paginate(
                Documents(
                    Collection('items')
                )
            ),
            // Get retrieves a single document identified by the reference
            Lambda(x => Get(x))
        )
    )
    // If the query is successful, the data is sent as response
    .then((data) => res.send(data))
    .catch((e) => res.send(e))
})


// API endpoint to create a new document in collection
app.post('/create', async(req, res) => {
    const doc = await client.query(
        // Create is used to create a new document in the collection
        Create(
            Collection('items'),
            // The data is passed as an object
            { data: { content: 'Hello World Again!' } },
        )
    )
    // If the query is successful, the data is sent as response
    .then((data) => res.send(data))
    .catch((e) => res.send(e))
})

// API endpoint to update the document with the reference ID
app.put('/update', async(req, res) => {
    const doc = await client.query(
        // Update is used to update the document with the below reference ID
        Update(
            Ref(
                Collection('items'),
                '300894802124210695'
            ),
            // The data is passed as an object
            { data: { content: 'Updated Content' } },
        )
    )
    // If the query is successful, the data is sent as response
    .then((data) => res.send(data))
    .catch((e) => res.send(e))
})

// API endpoint to delete the document with the reference ID
app.delete('/delete', async(req, res) => {
    const doc = await client.query(
        // Delete is used to delete the document with the below reference ID
        Delete(
            Ref(
                Collection('items'),
                '300894802124210695'
            )
        )
    )
    // If the query is successful, the data is sent as response
    .then((data) => res.send(data))
    .catch((e) => res.send(e))
})

exports.app = functions.https.onRequest(app)