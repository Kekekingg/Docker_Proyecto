const express = require('express')
const mysql2 = require('mysql2')
const path = require('path')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 3005
const JWT_SECRET = process.env.JWT_SECRET



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* END POINTS */ 

//Todo lo que esta en views lo tomara como archivos estaticos que puede leer
app.use(express.static('views'))//.use es un middleware
app.use(bodyParser.json())

/* CONEXION A BASE DE DATOS */
const connection = mysql2.createConnection({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err7 => {
    if (err7) {
        return console.error("Error conectando a la base de datos")
    }

    console.log("conectado a la base de datos")
})

//Autenticacion para entrar al inicio
const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    let token = "";
    if(authHeader) {
        token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err5, user)=>{
    if(err5){
            console.log(err5, "ERROR JWT");
            res.redirect(301, '/login')
            return;
    }
    req.user = user;
    next();
    });
} else{
    res.redirect(301, "/login");
}

};


//.end es un metodo que no permite meter mas data despues de haber sido invocado
// res.end("Hola")
app.get('', (req, res) => {
    //.sendFile() como su nombre lo indica manda un archivo y responde con un HTML
    res.sendFile(path.join(__dirname, "views/home.html"));//El join es para que el path sepa de donde sacar las vistas
});


// -> Logeo y registro <-
//En ambos get es necesario poner la ruta o el "/" 
app.get("/login", (req, res) => {
    //.sendFile() como su nombre lo indica manda un archivo y responde con un HTML
    res.sendFile(path.join(__dirname, "views/login.html"));//Reedirige al login
});
app.post("/login", (req, res)=>{
    const {username, password} = req.body;
    connection.query(
        "SELECT  * FROM  users WHERE username = ?", 
        [username], 
        (err, result)=>{
        if(err) throw err;

        if(result.length > 0 ){
            bcrypt.compare(password, result[0].password, (err2, match) =>{
                if(err2) throw err2;
                if(match) {
                    const token = jwt.sign({name: result[0].username}, JWT_SECRET, {
                        expiresIn:"20m",
                    });
                    res.json({success: true, message: "login correcto", token});
                }else {
                    res.status(404).send({
                        success: false, 
                        message: "usuario no encontrado",
                });
                }
            });
        } else{
            console.error("Error en la DB");
            res.status(404).send({
                success: false,
                message: "Tu usuario o contrasenia es incorrecto",
        });
        }
    }
    );
});
    // console.log(req.body)
    // res.status(200).send({message: "aun estamos trabajando..."})

app.get("/signup", (req, res) => {
    //.sendFile() como su nombre lo indica manda un archivo y responde con un HTML
    res.sendFile(path.join(__dirname, "views/signup.html"));//Redirige al signup
});
app.post("/signup", (req, res) => {
    const { username, password } = req.body  
    bcrypt.hash(password, 10, (err3, hash) => {
        if(err3) {
            return res.status(500).json({success: false, message: "No se puede crear el usuario"})
        }
        connection.query("INSERT INTO users (username, password) VALUES (?,?)", [username, hash], (err4, result) => {
            if(err4) {
                console.error(err4)
                return res.status(500).json({success:false, message: "No se pudo crear el usuario"})
            }
            //Si se inserto correctamente 
            res.json({success: true, message: "Usuario creado exitosamente"})
        })
    })
})

//Redireccion hacia la pagina principal
app.get("/principal",  (req, res) => {
    res.sendFile(path.join(__dirname, "views/principal.html"))
})

//Endpoint protegido con el authenticateToken
app.get("/api/principal", authenticateToken, (req, res)=> {
    // console.log(req.user);
    res.json({products: {camisas:["VueJS", "Angular", "ReactJS"]}, user:req.user.name })
})

app.get('/api/usersCustom', (req, res) => {
    const query = "SELECT * FROM users"
    connection.query(query, (err8, result) =>{
        if(err8) {
            return res.status(500).send("Error en la base de datos", err8)
        }

        res.json(result)
    })
})

app.get("/api/data", (req, res)=> {
    res.json({
        data: [
            {producto: "t-shirt", quantity: 130},
            {producto: "tazas", quantity: 32},
        ],
    });
});


app.listen(PORT, () => {
    console.log("El servidor esta corriendo en el puerto:", PORT)
})