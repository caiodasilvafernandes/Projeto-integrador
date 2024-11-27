const xhttp = new XMLHttpRequest();
var btnDelete = document.getElementById("btnDelete");
var btnContinuar = document.getElementById("btnContinuar");
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

            precoTotal.textContent = "R$" + valor;
        } else {
            valor -= parseInt(this.value);

            precoTotal.textContent = "R$" + valor;
        }
    });
});

btnContinuar.addEventListener("click", (e) => {
    e.preventDefault;

    let checkbox = document.querySelectorAll("input[type='checkbox']:checked");
    let idPack = [];
    let quantComp = checkbox.length;

    for (let i = 0; i <= checkbox.length - 1; i++) {

        if (checkbox[i]) {
            let input = document.createElement("input");

            input.type = "hidden";
            input.value = checkbox[i].id;
            input.name = "idPacote";

            console.log(input);


            formCart.appendChild(input);   
        } else {
            console.log("i invalida", i);

        }
    }

    formCart.submit();
});