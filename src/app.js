const express = require('express');
const routerUser = require('./routes/userRouter.js');
const cors = require('cors');
const routerLogin = require('./routes/loginRouter.js');
const routerCanchas = require('./routes/reservacanchaRouter.js');
const routerPiscinas = require('./routes/reservapiscinaRouter.js');
const routerSalones = require('./routes/reservasalonRouter.js');
const routerFuncionalidad = require('./routes/funcionalidadRouter.js');



const app = express()

//Para que app pueda leer json cuando se les envia datos json como en el post
app.use(express.json())

app.use(cors())
app.use('/api/proyce',routerUser)
app.use('/api/proyce',routerCanchas)
app.use('/api/proyce',routerPiscinas)
app.use('/api/proyce',routerSalones)
app.use('/api/proyce',routerFuncionalidad)


app.use('/auth',routerLogin)

//Importamos rutas...


//Si no encuentra ruta entonces...
app.use((req,res,next)=>{
    res.status(404).json({message: "End poitn not found" })
})

module.exports = app;