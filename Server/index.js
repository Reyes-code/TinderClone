const PORT = 8000
const express = require("express")
const {MongoClient} = require('mongodb')
const uri = "mongodb+srv://Reyes-coder:admin123@cluster0.6w63ngy.mongodb.net/tinder_db?retryWrites=true&w=majority";
const {v4:uuidv4} = require('uuid')
// uuid is to create a unique identifier
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { restart } = require("nodemon")

const app = express()
app.use(cors())
app.use(express.json())

// Default
app.get('/', (req, res) => {
    res.json('Server Is running OK')
})

// Sign up to the Database
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    console.log("📨 Signup request para:", email) // DEBUG

    try {
        await client.connect()
        const database = client.db('tinder_db') // O 'tinder_db'
        const users = database.collection('users')

        const existingUser = await users.findOne({email})
        console.log("🔍 Usuario existe?", !!existingUser) // DEBUG

        if (existingUser) {
            console.log("⚠️ Usuario ya existe:", email)
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }

        console.log("💾 Insertando usuario:", data) // DEBUG
        const result = await users.insertOne(data)
        console.log("✅ Usuario insertado:", result.insertedId) // DEBUG

        // CORRECCIÓN: Generar token correctamente
        const token = jwt.sign(
            { userId: generatedUserId, email: sanitizedEmail },
            sanitizedEmail, // Esto debería ser un secreto mejor
            { expiresIn: 60 * 24 } // 24 horas
        )
        
        // CORRECCIÓN: Retornar el userId correcto
        console.log("🎫 Token generado, userId:", generatedUserId) // DEBUG
        res.status(201).json({
            token, 
            userId: generatedUserId,  // ¡Aquí estaba el error!
            email: sanitizedEmail
        })

    } catch (err) {
        console.log("❌ Error en signup:", err)
        res.status(500).send('Internal server error')
    } finally {
        await client.close()
    }
})

// Log in to the Database
// En server.js - CORRIGE el endpoint /login
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const {email, password} = req.body
    
    console.log("🔐 Login attempt for:", email) // DEBUG

    try {
        await client.connect()
        const database = client.db('tinder_db')
        const users = database.collection('users')

        const sanitizedEmail = email.toLowerCase()
        const user = await users.findOne({email: sanitizedEmail})
        console.log("🔍 Usuario encontrado:", user ? "Sí" : "No") // DEBUG

        if (!user) {
            console.log("❌ Usuario no encontrado")
            return res.status(400).send('Invalid Credentials')
        }

        const correctPassword = await bcrypt.compare(password, user.hashed_password)
        console.log("🔑 Password correcta?", correctPassword) // DEBUG

        if (correctPassword) {
            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                sanitizedEmail,
                { expiresIn: 60 * 24 }
            )
            console.log("✅ Login exitoso, userId:", user.user_id)
            return res.status(200).json({
                token, 
                userId: user.user_id,
                email: user.email
            })
        } else {
            console.log("❌ Password incorrecta")
            return res.status(400).send('Invalid Credentials')
        }

    } catch (err) {
        console.log("❌ Error en login:", err)
        res.status(500).send('Internal server error')
    } finally {
        await client.close()
    }
})



app.get('/users',async (req, res)=>{
    const client = new MongoClient(uri)

    try{
        await client.connect()
        const database = client.db('tinder_db')
        const users = database.collection('users')
        
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
   } finally{
        await client.close()
}
})


app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('tinder_db')
        const users = database.collection('users')

        const query = {user_id: formData.user_id}

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})


// Añade este endpoint ANTES de app.listen()
app.get('/user/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  
  console.log(`📋 Obteniendo datos del usuario: ${userId}`);
  
  try {
    await client.connect();
    const database = client.db('tinder_db'); // Asegúrate que sea tu BD
    const users = database.collection('users');
    
    const user = await users.findOne({ user_id: userId });
    
    if (!user) {
      console.log(`❌ Usuario ${userId} no encontrado`);
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }
    
    console.log(`✅ Usuario encontrado: ${user.email}`);
    
    // Retornar datos seguros (sin password)
    const userData = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name || '',
      dob_day: user.dob_day || '',
      dob_month: user.dob_month || '',
      dob_year: user.dob_year || '',
      show_gender: user.show_gender || false,
      gender_identity: user.gender_identity || '',
      gender_interest: user.gender_interest || '',
      url: user.url || '',
      about: user.about || '',
      matches: user.matches || []
    };
    
    res.json({
      success: true,
      user: userData
    });
    
  } catch (err) {
    console.error('❌ Error obteniendo usuario:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error del servidor' 
    });
  } finally {
    await client.close();
  }
});


 





app.listen(PORT,() => console.log("server running on PORT: "+PORT))