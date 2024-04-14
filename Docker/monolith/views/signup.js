document.getElementById("register-form").addEventListener("submit", (event) => {
    //Refresh para evitar que se conecte a otro backend
    event.preventDefault()
    //Obtenemos los valores en la consola
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    console.log(username, password);

    /* ENDPOINT */
    fetch('/signup', {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers: {'Content-type': 'application/json'} //Ayuda al servidor a identificar que datos va a recibir 
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("Usuario creado exitosamente!")
            
            //Redireccion hacia la pagina principal
            window.location.href = "/principal"
        } else {
            alert("Algo salio mal... intenta nuevamente")
        }
    })
    .catch((err) => console.error("Error", err))
})