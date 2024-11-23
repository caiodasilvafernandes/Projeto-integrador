const xhttp = new XMLHttpRequest();
var btnDelete = document.getElementById("btnDelete");
var btnContinuar = document.getElementById("btnContinuar");
var checkbox = document.getElementsByName("prod");
var comprarPack = [];

function deleteCar(idCliente,idPack){
    idCliente = parseInt(idCliente); 
    idPack = parseInt(idPack); 

    xhttp.open("DELETE", `/deleteCar/${idCliente}/${idPack}`);
    xhttp.send();
}

btnDelete.addEventListener("click",(event)=>{
    let nome = btnDelete.name.split(",");
    let idCliente = nome[0];
    let idPack = nome[1];
    deleteCar(idCliente, idPack);
    
    let div = document.getElementById(idPack);
    closest(".row productRow").remove();
});

checkbox.addEventListener("click",()=>{
    console.log(checkbox.check);
    
})

btnContinuar.addEventListener("click",()=>{
    let checkbox = document.querySelectorAll("input[type='checkbox']:checked");
    let comprarPack = []
    for(check of checkbox){
        comprarPack.push(check.id);
    }
    
});