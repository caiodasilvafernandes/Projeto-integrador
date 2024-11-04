const xhttp = new XMLHttpRequest();

function controleFav(id, fav) {
    id = parseInt(id);
    
    xhttp.open("post", `/ControleFavorita/${id}/${fav}`);
    xhttp.send();
}

function controleAvalia(id, nota) {
    xhttp.open("post", `/ControleAvalia/${id}/${nota}`);
    xhttp.send();
}

function controleComent(id, coment){
    console.log("id", id);
    console.log("comentario:", coment);
    
    xhttp.open("post", `/controleComent/${id}/${coment}`);
    xhttp.send();
}