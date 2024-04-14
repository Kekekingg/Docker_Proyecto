document.getElementById("login-form").addEventListener("submit", (event) => {
    //Refresh para evitar que se conecte a otro backend
    event.preventDefault()
    //Obtenemos los valores en la consola
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    console.log(username, password);

    /* ENDPOINT */
    fetch('/login', {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'} //Ayuda al servidor a identificar que datos va a recibir 
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        if (data.success) {
            localStorage.setItem("token", data.token)
            window.location.href = "/principal"
            alert("Bienvenido")
        } else {
            alert("Tu usuario o contraseña son incorrectos")
        }
        // if(data.success) {
        //     //console.log(data.token)
        //     localStorage.setItem("token", data.token)
        //     window.location.href = "DevDress/index"
        // } else {
        //     alert("Tu usuario y/o contraseña es incorrecta")
        // }
    })
    .catch((err) => console.error("Error", err))
})
