const xhttp = new XMLHttpRequest();

function controleFav(method, id, fav) {
    id = parseInt(id);
    xhttp.open(method, `/ControleFavorita/${id}/${fav}`);
    xhttp.send();
}

function controleAvalia(method,id){
    
}