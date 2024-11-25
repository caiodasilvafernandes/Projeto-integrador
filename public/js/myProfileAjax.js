const xhttp = new XMLHttpRequest();

document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();

      const idPacote = this.getAttribute('data-id');  
      if (confirm('Tem certeza que deseja excluir este pacote?')) {

        xhttp.open("delete",`/deletaPacote/${idPacote}`);
        xhttp.send();
        this.closest('.col').remove();
        fetch(`/deletaPacote/${idPacote}`, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Pacote deletado com sucesso!');
            this.closest('.col').remove();
            return;
          } else {
            alert('Erro ao excluir o pacote!');
          }
        })
      }
    });
  });