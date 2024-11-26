const xhttp = new XMLHttpRequest();
var btnDelete = document.getElementById("btnDelete");
var formCart = document.getElementById("formCart");
const checkboxes = document.querySelectorAll('input[name="prod"]');
const precoTotal = document.getElementById("precoTotal");
const preco = document.getElementById("preco");
const quant = document.getElementById("quant");
const idPacote = document.getElementById("idPacote");
var comprarPack = [];

function deleteCar(idCliente, idPack) {
    idCliente = parseInt(idCliente);
    idPack = parseInt(idPack);

    xhttp.open("DELETE", `/deleteCar/${idCliente}/${idPack}`);
    xhttp.send();
}

btnDelete.addEventListener("click", (event) => {
    let nome = btnDelete.name.split(",");
    let idCliente = nome[0];
    let idPack = nome[1];
    deleteCar(idCliente, idPack);

    let div = document.getElementById(idPack);
    closest(".row productRow").remove();
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        let split = precoTotal.textContent.split("$");
        let valor = parseInt(split[1]);

        if (this.checked) {
            valor += parseInt(this.value);

            precoTotal.textContent ="R$" + valor;
        } else {
            valor -= parseInt(this.value);

            precoTotal.textContent ="R$" + valor;
        }
    });
});

formCart.addEventListener("submit", (e) => {
    e.preventDefault;

    let checkbox = document.querySelectorAll("input[type='checkbox']:checked");
    let idPack = [];
    let quantComp = checkbox.length;
    let precoTotal = precoTotal.textContent;
    
    for (check of checkbox) {
        idPack.push(check.id);
    }

    idPacote.value = parseInt(idPack);
    quant.value = parseInt(quantComp);
    preco.value = parseInt(precoTotal);

    e.submit();
});