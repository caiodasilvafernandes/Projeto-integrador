const xhttp = new XMLHttpRequest();

function controleFav(id, fav) {
    id = parseInt(id);
    
    xhttp.open("post", `/ControleFavorita/${id}/${fav}`);
    xhttp.send();
}

function controleCar(id, car) {
    id = parseInt(id);
    
    xhttp.open("post", `/ControleCarrinho/${id}/${car}`);
    xhttp.send();
}

function controleAvalia(id, nota) {
    xhttp.open("post", `/ControleAvalia/${id}/${nota}`);
    xhttp.send();
}

function controleComent(id, coment){

    xhttp.open("post", `/controleComent/${id}/${coment}`);
    xhttp.send();
}

function gerarComent(){
    let href = location.href.split("/");
    href.reverse();
    let slug = href[0];
    let id = href[1];

    
}

gerarComent();