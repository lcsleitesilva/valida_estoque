// Aguarda o HTML da página carregar completamente
document.addEventListener("DOMContentLoaded", () => {
  
  // Busca o nome do usuário salvo na sessão do navegador
  // (Esse dado seria salvo lá no momento em que o login desse sucesso)
  const nomeUsuario = sessionStorage.getItem("nomeUsuario");
  
  // Pega o elemento H2 pelo ID que criamos
  const elementoSaudacao = document.getElementById("mensagem-saudacao");

  // Se existir um nome na sessão, atualiza o texto na tela
  if (nomeUsuario && elementoSaudacao) {
    elementoSaudacao.textContent = `Olá, ${nomeUsuario}!`;
  } else if (!nomeUsuario) {
    // Tratamento de segurança básico: se não tiver ninguém logado, 
    // você pode redirecionar a pessoa de volta pra tela de login
    // window.location.href = "login.html";
  }
});