const PORT = 8000
const express = require("express")
const {MongoClient} = require('mongodb')
const uri ="mongodb+srv://Reyes-coder:mypassword17@cluster0.idgyhwh.mongodb.net/Cluster0?retryWrites=true&w=majority"
const {v4:uuidv4} = require('uuid')
// uuid is to create a unique identifier
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req, res)=>{
    res.json('Hello to my app')
})

app.post('/signup', async (req, res)=>{
    const client = new MongoClient(uri)
    console.log(req.body)
    const{email,password} = req.body

    const generateduserID = uuidv4()
    const hashedpassword = await bcrypt.hash(password,10)

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({email})

        if (existingUser){s
            return res.status(409).send('User Already exists. Please login')
        }
         const sanitizedEmail= email.toLowerCase()

         const data ={
            user_id: generateduserID,
            email: sanitizedEmail,
            password: hashedpassword,
         }

         const insertedUser = await users.insertOne(data)

         const token = jwt.sign(insertedUser, sanitizedEmail,{
            expiresIn:60*24
        })

        res.status(201).json({token, userId:generateduserID, email:sanitizedEmail})
    }catch(err){
        console. log(err.response)
    }

})

app.get('/users',async (req, res)=>{
    const client = new MongoClient(uri)

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
0    } finally{
        await client.close()
}
})

app.listen(PORT,() => console.log("server running on PORT: "+PORT))