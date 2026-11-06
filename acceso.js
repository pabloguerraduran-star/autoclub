// Acceso a la plataforma Autoclub (2-nov-2026): nada se ve sin iniciar sesión.
// Usuario compartido (ver _datos/plataforma_github/acceso_PRIVADO.json). La sesión queda guardada en el equipo.
// Uso: const db = await acceso.cliente();  ·  const txt = await acceso.archivo('ventas/semanas.csv');
window.acceso = (() => {
  const MA = (window.MARCA || {}).supabase || {};
  const URL_ = MA.url || 'https://rrsmeduifzgalmxbaacj.supabase.co';
  const KEY = MA.key || '';
  let db, listo;

  const CSS = `
  #acc{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:#F5F0E6;color:#1A1A78;font-family:Georgia,serif}
  #acc form{width:100%;max-width:20rem;display:grid;gap:12px}
  #acc h1{margin:0 0 4px;font-size:1.6rem;font-weight:600}
  #acc p{margin:0;font-size:.9rem;color:#5a5880}
  #acc label{display:grid;gap:4px;font-size:.85rem}
  #acc input{font:inherit;font-size:1rem;padding:10px 12px;border:1px solid #c9c2ae;border-radius:8px;background:#fff;color:#1d1b2e}
  #acc button{font:inherit;font-size:1rem;padding:11px;border:0;border-radius:8px;background:#1A1A78;color:#F5F0E6;cursor:pointer}
  #acc button:disabled{opacity:.6}
  #acc .err{color:#b3261e;min-height:1.2em}
  #acc-salir{position:fixed;right:12px;bottom:10px;z-index:50;font:12px Georgia,serif;color:#6b6880;background:none;border:0;text-decoration:underline;cursor:pointer}
  @media (prefers-color-scheme:dark){
    #acc{background:#141322;color:#ecebf5} #acc p{color:#a3a1b8}
    #acc input{background:#1c1b2e;color:#ecebf5;border-color:#34324a} #acc button{background:#b4b4ff;color:#141322}
    #acc .err{color:#f2867c} #acc-salir{color:#a3a1b8}
  }`;

  function salirBtn() {
    if (document.getElementById('acc-salir')) return;
    const b = document.createElement('button');
    b.id = 'acc-salir'; b.type = 'button'; b.textContent = 'Cerrar sesión';
    b.onclick = async () => { await db.auth.signOut(); location.reload(); };
    document.body.appendChild(b);
  }

  function formulario() {
    return new Promise(resolve => {
      const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      const d = document.createElement('div'); d.id = 'acc';
      d.innerHTML = `<form autocomplete="on" method="post" action="#">
        <h1>${(window.MARCA||{}).nombre||'Plataforma'}</h1><p>Plataforma interna. Ingresa con tu usuario y clave.</p>
        <label>Usuario<input name="username" id="acc-u" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>
        <label>Clave<input name="password" id="acc-c" type="password" autocomplete="current-password" required></label>
        <button>Entrar</button><div class="err" role="alert"></div></form>`;
      document.body.appendChild(d);
      const f = d.querySelector('form'), err = d.querySelector('.err'), btn = d.querySelector('button');
      if (!f.username.value) f.username.focus();
      f.onsubmit = async ev => {
        ev.preventDefault(); err.textContent = ''; btn.disabled = true;
        const u = f.username.value.trim().toLowerCase();
        const { error } = await db.auth.signInWithPassword({ email: u.includes('@') ? u : u + '@' + (MA.dominio || 'autoclub.local'), password: f.password.value });
        btn.disabled = false;
        if (error) { err.textContent = 'Usuario o clave incorrectos.'; return; }
        // Que el navegador ofrezca guardar la clave (Chrome/Android; Safari y el llavero de iPhone lo detectan solos al enviar)
        try { if (window.PasswordCredential) await navigator.credentials.store(new PasswordCredential({ id: u, password: f.password.value, name: 'Autoclub' })); } catch (e) {}
        d.remove(); resolve();
      };
    });
  }

  function cliente() {
    if (!listo) listo = (async () => {
      db = window.supabase.createClient(URL_, KEY, { auth: { persistSession: true, storageKey: 'autoclub_sesion' } });
      const { data } = await db.auth.getSession();
      if (!data.session) await formulario();
      salirBtn();
      return db;
    })();
    return listo;
  }

  async function archivo(ruta) {
    const c = await cliente();
    const { data, error } = await c.storage.from('privado').download(ruta);
    if (error) throw error;
    return data.text();
  }

  // 4-nov-2026: `equipo` ve cocina; `administracion` ve todo. El bloqueo real está en Supabase (sql/acceso_dos_usuarios.sql).
  async function esAdmin() {
    const c = await cliente();
    const { data } = await c.auth.getSession();
    return ((data.session && data.session.user.email) || '') === (MA.admin || 'administracion@autoclub.local');
  }

  async function soloAdmin() {
    if (await esAdmin()) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'acc';
    d.innerHTML = `<form><h1>${(window.MARCA||{}).nombre||'Plataforma'}</h1><p>Esta sección es de administración. Tu usuario no tiene acceso.</p>
      <a href="../" style="color:inherit">Volver al inicio</a><button type="button">Entrar con otro usuario</button></form>`;
    d.querySelector('button').onclick = async () => { await db.auth.signOut(); location.reload(); };
    document.body.appendChild(d);
    return new Promise(() => {});  // la página no sigue cargando
  }

  return { cliente, archivo, esAdmin, soloAdmin };
})();
