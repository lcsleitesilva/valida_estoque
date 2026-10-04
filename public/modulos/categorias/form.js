document.addEventListener("DOMContentLoaded", function () {
    // 1. Lê a URL para ver se tem um ID (ex: form.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const idCategoria = urlParams.get('id');

    const form = document.getElementById("form-categoria");
    const tituloTela = document.getElementById("titulo-tela");

    // Lógica para voltar à listagem
    document.getElementById("btn-cancelar").addEventListener("click", () => {
        // Redireciona para o index de categorias (você criará essa tela depois)
        window.location.href = "index.html"; 
    });

    // 2. Se tiver ID, estamos no Modo Edição
    if (idCategoria) {
        tituloTela.textContent = "Editar Categoria";
        carregarDadosCategoria(idCategoria);
    } else {
        tituloTela.textContent = "Nova Categoria";
    }

    // 3. Função para buscar a categoria do db.json via json-server
    function carregarDadosCategoria(id) {
        fetch(`/categorias/${id}`)
            .then(response => {
                // Se o servidor respondeu, mas não achou o ID (Erro 404)
                if (response.status === 404) {
                    throw new Error("404_NOT_FOUND");
                }
                // Se deu qualquer outro erro de comunicação
                if (!response.ok) {
                    throw new Error("API_OFFLINE");
                }
                return response.json();
            })
            .then(categoria => {
                // Preenche os campos do formulário com os dados recebidos
                document.getElementById("nome").value = categoria.nome;
                document.getElementById("descricao").value = categoria.descricao;
                document.getElementById("cor").value = categoria.cor || "";
            })
            .catch(error => {
                if (error.message === "404_NOT_FOUND") {
                    alert("A categoria solicitada não existe! Redirecionando para novo cadastro.");
                    window.location.href = "form.html"; // Recarrega a página limpando o ID falso da URL
                } else {
                    console.warn("API offline. Fallback visual ativado.");
                    // Fallback offline (para testes de layout sem o json-server)
                    document.getElementById("nome").value = "Bebidas (Modo Offline)";
                    document.getElementById("descricao").value = "Sucos, refrigerantes e águas.";
                    document.getElementById("cor").value = "#0000FF";
                }
            });
    }

    // 4. Captura o "Salvar"
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recarregar a página
        
        const dadosCategoria = {
            nome: document.getElementById("nome").value,
            descricao: document.getElementById("descricao").value,
            cor: document.getElementById("cor").value
        };

        // Se tem ID, atualiza (PUT). Se não tem, cria (POST).
        const metodo = idCategoria ? 'PUT' : 'POST';
        const urlFetch = idCategoria ? `/categorias/${idCategoria}` : `/categorias`;

        fetch(urlFetch, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCategoria)
        })
        .then(() => {
            alert("Salvo com sucesso!");
            window.location.href = "index.html";
        })
        .catch(() => {
            alert("Erro ao salvar! Verifique se o json-server está rodando.");
        });
    });
});