function salvarSessao(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

function usuarioLogado() {
  const dados = localStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
}

function encerrarSessao() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

// Protege páginas internas: redireciona para o login se não houver token
function exigirLogin() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
  }
}

// Injeta a navegação lateral/menu e liga o botão hambúrguer no mobile
function montarNavegacao(paginaAtual) {
  const usuario = usuarioLogado();
  const itens = [
    { href: 'dashboard.html', label: 'Painel' },
    { href: 'matricula.html', label: 'Matrícula' },
    { href: 'frequencia.html', label: 'Frequência' },
    { href: 'documentos.html', label: 'Documentos' },
  ];

  if (usuario && (usuario.tipo === 'professor' || usuario.tipo === 'admin')) {
    itens.push({ href: 'frequencia-professor.html', label: 'Lançar frequência' });
  }
  if (usuario && usuario.tipo === 'admin') {
    itens.push({ href: 'admin.html', label: 'Cursos e disciplinas' });
  }

  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.id = 'side-nav';

  const marca = document.createElement('div');
  marca.className = 'wordmark';
  marca.innerHTML = 'Portal<span>Acadêmico</span>';
  nav.appendChild(marca);

  itens.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    if (item.href === paginaAtual) link.classList.add('active');
    nav.appendChild(link);
  });

  const sair = document.createElement('a');
  sair.href = '#';
  sair.textContent = `Sair (${usuario ? usuario.nome : ''})`;
  sair.onclick = (e) => { e.preventDefault(); encerrarSessao(); };
  nav.appendChild(sair);

  document.body.prepend(nav);

  const topbar = document.createElement('div');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <div class="wordmark">Portal<span>Acadêmico</span></div>
    <button id="menu-toggle" aria-label="Abrir menu">&#9776;</button>
  `;
  document.body.prepend(topbar);

  document.getElementById('menu-toggle').addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}
