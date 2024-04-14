//Va a contener toda la logica del front y del back
//Servidor express
//Axios es para las solicitudes sin usar el fetch
//EJS no se necesita indicar como los primeros const 

const  axios = require('axios')
const express = require('express')
const app = express()
const path = require('path')
const PORT = 3005

const camisas = [
    {title: "VueJS", talla: "Mediana", costo: 15},
    {title: "Angular", talla: "Chica", costo: 10},
    {title: "ReactJS", talla: "Grande", costo: 20},
]

app.use(express.static('views'))
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.get("/", async (req, res)=>{
  let url = "http://microservicio:3002/api/productos"

  try {
    const microserviceResponce = await axios.get(url)
    let data = microserviceResponce.data
    res.render('index', {camisas, data})
  }
  catch(err) {
    res.json({message:`error: ${err.message}`})
  }

  res.render('index', {books})
})

app.listen(PORT, ()=>{
  console.log("Server is running on port", PORT)
})

