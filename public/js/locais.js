document.addEventListener("DOMContentLoaded", () => {
  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estate");
  const cidadeSelect = document.getElementById("city");
  let paisId = null;

  async function conexao(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`erro ${url}: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  conexao("/getPais").then((paises) => {
    paisSelect.innerHTML = '<option value="0">Selecione um país</option>';
    paises.forEach((pais) => {
      const option = document.createElement("option");
      option.value = pais.idPais;
      option.textContent = pais.nome_pt;
      paisSelect.appendChild(option);
    });
  });

  paisSelect.addEventListener("change", () => {
    paisId = paisSelect.value;

    estadoSelect.innerHTML = '<option value="0">Selecione um estado</option>';
    cidadeSelect.innerHTML = '<option value="0">Selecione uma cidade</option>';

    if (paisId !== "0") {
      conexao(`/getEstado/${paisId}`).then((estados) => {
        estados.forEach((estado) => {
          const option = document.createElement("option");
          option.value = estado.idEstado;
          option.textContent = estado.nome;
          estadoSelect.appendChild(option);
        });
      });
    }
  });

  estadoSelect.addEventListener("change", () => {
    const estadoId = estadoSelect.value;

    cidadeSelect.innerHTML = '<option value="0">Selecione uma cidade</option>';

    if (estadoId !== "0") {
      conexao(`/getCidade/${estadoId}`).then((cidades) => {
        cidades.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.idCidade;
          option.textContent = city.nome;
          cidadeSelect.appendChild(option);
        });
      });
    }
  });
});
