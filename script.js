
function toggleResposta(btn) {
  const resposta = btn.nextElementSibling;
  resposta.style.display = resposta.style.display === 'block' ? 'none' : 'block';
  btn.textContent = resposta.style.display === 'block' ? 'Ocultar Resposta' : 'Mostrar Resposta';
}

function verificarResposta(botao) {
  const exercicio = botao.parentElement;
  const entrada = exercicio.querySelector("textarea").value.trim();
  const feedback = exercicio.querySelector(".feedback");
  const respostaCorreta = botao.dataset.resposta;

  if (!entrada) {
    feedback.textContent = "❌ Digite sua resposta antes de verificar.";
    feedback.style.color = "red";
    return;
  }

  const entradaLimpa = entrada.replace(/\s/g, '').toLowerCase();
  const limpar = texto => texto.replace(/\s/g, '').toLowerCase();

  // Lógica flexível para principais padrões
  const sugestao = limpar(respostaCorreta);

  // Ex. 01 - Validação de nota entre 0 e 10
  if (
    sugestao.includes("nota=float(input(") &&
    entradaLimpa.includes("while") &&
    entradaLimpa.includes("nota<0ornota>10") &&
    entradaLimpa.includes("input(") &&
    entradaLimpa.includes("print(")
  ) {
    feedback.textContent = "✅ Lógica válida! Código aprovado.";
    feedback.style.color = "green";
    return;
  }

  // Ex. 02 - Login != senha
  if (
    sugestao.includes("usuario!=") &&
    entradaLimpa.includes("input(") &&
    entradaLimpa.includes("while") &&
    entradaLimpa.includes("usuario!=")
  ) {
    feedback.textContent = "✅ Login válido!";
    feedback.style.color = "green";
    return;
  }

  // Ex. 03 - Soma de 1 a 100
  if (
    sugestao.includes("soma+=i") &&
    entradaLimpa.includes("i=1") &&
    entradaLimpa.includes("while") &&
    entradaLimpa.includes("i<=100")
  ) {
    feedback.textContent = "✅ Soma correta!";
    feedback.style.color = "green";
    return;
  }

  // Ex. 04 - Tabuada do 5
  if (
    sugestao.includes("5*i") &&
    entradaLimpa.includes("for") &&
    entradaLimpa.includes("range(1,11)") &&
    entradaLimpa.includes("print(")
  ) {
    feedback.textContent = "✅ Tabuada correta!";
    feedback.style.color = "green";
    return;
  }

  // Comparação exata (fallback)
  const igual = limpar(entrada) === sugestao;
  if (igual) {
    feedback.textContent = "✅ Resposta correta!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "⚠️ Seu código pode funcionar, mas está diferente da sugestão. Compare a lógica ou clique em 'Mostrar Resposta'.";
    feedback.style.color = "#e67e22";
  }
}

// Botão voltar ao topo
const btnTopo = document.querySelector('.btn-topo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 200 ? 'block' : 'none';
  const scrollPosition = window.scrollY + 100;
  document.querySelectorAll('.exercicio').forEach((section) => {
    const id = section.getAttribute('id');
    if (section.offsetTop <= scrollPosition) {
      document.querySelectorAll('.indice a').forEach(link => link.classList.remove('ativo'));
      const linkAtual = document.querySelector(`.indice a[href="#${id}"]`);
      if (linkAtual) linkAtual.classList.add('ativo');
    }
  });
});

// Toggle menu mobile
const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
if (toggleBtn && menu) {
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// Botões copiar
document.querySelectorAll('pre code').forEach((codeBlock) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'bloco-codigo';

  const btn = document.createElement('button');
  btn.textContent = '📋 Copiar';
  btn.className = 'btn-copiar';

  btn.onclick = () => {
    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
      btn.textContent = '✔️ Copiado!';
      setTimeout(() => (btn.textContent = '📋 Copiar'), 2000);
    });
  };

  codeBlock.parentElement.replaceWith(wrapper);
  wrapper.appendChild(btn);
  wrapper.appendChild(codeBlock);
});

// Botão copiar nas respostas
document.querySelectorAll('.resposta').forEach(resposta => {
  const btn = document.createElement('button');
  btn.textContent = '📋 Copiar';
  btn.classList.add('copiar-codigo');

  btn.onclick = () => {
    const codigo = resposta.querySelector('code').innerText;
    navigator.clipboard.writeText(codigo).then(() => {
      btn.textContent = '✔️ Copiado!';
      setTimeout(() => (btn.textContent = '📋 Copiar'), 1500);
    });
  };

  resposta.appendChild(btn);
});

// Tema claro/escuro
function alternarTema() {
  document.body.classList.toggle('tema-claro');
  const temaAtual = document.body.classList.contains('tema-claro') ? 'claro' : 'escuro';
  localStorage.setItem('tema', temaAtual);
}
window.onload = () => {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'claro') {
    document.body.classList.add('tema-claro');
  }

  // Geração dinâmica do índice lateral
  const lista = document.getElementById('lista-exercicios');
  const exercicios = document.querySelectorAll('.exercicio');
  if (lista && exercicios.length > 0) {
    lista.innerHTML = '';
    exercicios.forEach((ex, i) => {
      const id = ex.getAttribute('id');
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = `Ex. ${String(i + 1).padStart(2, '0')}`;
      link.href = `#${id}`;
      link.classList.add('indice-link');
      item.appendChild(link);
      lista.appendChild(item);
    });
  }
};
