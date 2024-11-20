const xhttp = new XMLHttpRequest();
var btnDelete = document.getElementById("btnDelete");

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