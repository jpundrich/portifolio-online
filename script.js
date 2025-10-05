// porquê: roda só quando o HTML estiver carregado
document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // 1) VALIDAÇÃO DO FORMULÁRIO
  // =========================

  // porquê: pega referências dos campos
  const form = document.getElementById('form-contato');
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const tel = document.getElementById('tel');
  const msg = document.getElementById('mensagem');
  const btn = document.getElementById('enviar');

  // porquê: regex simples e suficiente para validar formato de e-mail
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // porquê: remove marcação de erro enquanto o usuário digita
  [nome, email, tel, msg].forEach(el => {
    el?.addEventListener('input', () => {
      el.classList.remove('erro');
      el.setAttribute('aria-invalid', 'false');
    });
  });

  // porquê: intercepta o envio para validar antes
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // limpa estados anteriores
    [nome, email, tel, msg].forEach(el => {
      el.classList.remove('erro');
      el.setAttribute('aria-invalid', 'false');
    });

    // valida campos obrigatórios
    let temErro = false;
    if (!nome.value.trim()) { marcaErro(nome); temErro = true; }
    if (!email.value.trim()) { marcaErro(email); temErro = true; }
    if (!msg.value.trim()) { marcaErro(msg); temErro = true; }

    // valida e-mail
    if (!temErro && !REGEX_EMAIL.test(email.value.trim())) {
      marcaErro(email);
      modal('Digite um e-mail válido (ex.: usuario@dominio.com).');
      return;
    }

    // valida telefone (opcional: aqui só checo 10+ dígitos)
    const digits = tel.value.replace(/\D/g, '');
    if (tel.hasAttribute('required') && digits.length < 10) {
      marcaErro(tel);
      modal('Informe um telefone válido com DDD.');
      return;
    }

    if (temErro) {
      modal('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // =========================
    // 2) SIMULAÇÃO DE ENVIO
    // =========================
    btn.disabled = true;
    const textoOriginal = btn.textContent;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      // porquê: mensagem de sucesso + limpa o formulário
      modal(`Obrigado, ${nome.value.trim()}! Mensagem enviada com sucesso.`);
      form.reset();
      btn.disabled = false;
      btn.textContent = textoOriginal;
    }, 1200);
  });

  function marcaErro(el) {
    el.classList.add('erro');
    el.setAttribute('aria-invalid', 'true');
    el.focus({ preventScroll: false });
  }

  // =========================
  // 3) MODAL DE MENSAGEM
  // =========================

  // porquê: cria modal uma única vez e reaproveita
  let $modal = null;
  function criaModalBase() {
    const wrap = document.createElement('div');
    wrap.id = 'modal';
    wrap.style.cssText = `
      position: fixed; inset: 0; display: none; z-index: 9999;
      background: rgba(0,0,0,.45); align-items: center; justify-content: center;
    `;
    wrap.innerHTML = `
      <div id="modal-caixa" style="
        background:#fff; color:#222; padding:16px 20px; border-radius:10px;
        min-width:280px; max-width:90vw; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,.2);
      ">
        <p id="modal-texto" style="margin:0 0 10px 0;">Mensagem</p>
        <button id="modal-fechar" type="button" style="
          padding:8px 14px; border:0; border-radius:6px; background:#1aa7a7; color:#fff; font-weight:700; cursor:pointer;
        ">OK</button>
      </div>
    `;
    document.body.appendChild(wrap);

    wrap.addEventListener('click', (ev) => {
      if (ev.target.id === 'modal' || ev.target.id === 'modal-fechar') fechaModal();
    });

    return wrap;
  }

  function modal(texto) {
    if (!$modal) $modal = criaModalBase();
    $modal.querySelector('#modal-texto').textContent = texto;
    $modal.style.display = 'flex';
  }
  function fechaModal() {
    if ($modal) $modal.style.display = 'none';
  }

  // =========================
  // 4) MENU RESPONSIVO (interação simples)
  // =========================

  // porquê: se não existir botão de menu no HTML, crio um automaticamente
  const nav = document.querySelector('nav.menu');
  if (nav) {
    const btnMenu = document.createElement('button');
    btnMenu.id = 'btn-menu';
    btnMenu.type = 'button';
    btnMenu.textContent = 'Menu';
    btnMenu.style.cssText = `
      display:none; margin:10px auto 0; padding:6px 12px; border-radius:6px; border:1px solid #506E6A;
      background:#fff; cursor:pointer;
    `;
    nav.parentNode.insertBefore(btnMenu, nav); // porquê: coloca o botão logo acima do nav

    // porquê: mostra o botão em telas pequenas
    const mq = window.matchMedia('(max-width: 768px)');
    function aplicaMQ(e) {
      btnMenu.style.display = e.matches ? 'inline-block' : 'none';
      nav.style.display = e.matches ? 'none' : 'block';
    }
    aplicaMQ(mq);
    mq.addEventListener('change', aplicaMQ);

    btnMenu.addEventListener('click', () => {
      const visivel = nav.style.display !== 'none';
      nav.style.display = visivel ? 'none' : 'block';
    });
  }

  // =========================
  // 5) TEMA CLARO/ESCURO (opcional do enunciado)
  // =========================

  // porquê: adiciona um botão de tema no topo, sem mexer no HTML
  const header = document.querySelector('header.container');
  if (header) {
    const btnTema = document.createElement('button');
    btnTema.id = 'btn-tema';
    btnTema.type = 'button';
    btnTema.textContent = 'Tema: Claro';
    btnTema.style.cssText = `
      position:absolute; right:20px; top:12px; padding:6px 10px; border:0; border-radius:6px;
      background:#0d3c91; color:#fff; cursor:pointer; font-weight:700;
    `;
    header.style.position = 'relative';
    header.appendChild(btnTema);

    // porquê: restaura escolha anterior, se houver
    if (localStorage.getItem('tema') === 'escuro') {
      document.body.classList.add('tema-escuro');
      btnTema.textContent = 'Tema: Escuro';
    }

    btnTema.addEventListener('click', () => {
      document.body.classList.toggle('tema-escuro');
      const escuro = document.body.classList.contains('tema-escuro');
      btnTema.textContent = escuro ? 'Tema: Escuro' : 'Tema: Claro';
      localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    });
  }

});