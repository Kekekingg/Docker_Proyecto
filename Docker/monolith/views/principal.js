document.addEventListener("DOMContentLoaded", ()=>{
    const token = localStorage.getItem("token");

    if(!token){
        window.location.href = "/login";
        return;

    }
    fetch("/api/principal", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, //Comprobacion de autorizacion en postman
        },
    })
    .then((response)=> {
        return response.json();
    })
    .then((data)=>{
        document.querySelector("h1").innerHTML = `Bienvenido a nuestra tienda${data.user}!`
    })
    .catch((err)=> console.error("error", err));
});