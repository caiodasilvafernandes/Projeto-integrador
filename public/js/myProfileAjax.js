document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();

      const idPacote = this.getAttribute('data-id');
    console.log(idPacote);        
      if (confirm('Tem certeza que deseja excluir este pacote?')) {
        fetch(`/deletaPacote/${idPacote}`, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Pacote deletado com sucesso!');
            this.closest('.col').remove();
          } else {
            alert('Erro ao excluir o pacote!');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao tentar excluir o pacote.');
        });
      }
    });
  });