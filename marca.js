// MARCA — lo único que se cambia para customizar la plataforma en otro proyecto.
// Cargar ANTES de acceso.js y shell.js:  <script src="../marca.js"></script>
window.MARCA = {
  nombre: 'Autoclub',
  // Colores (claro). El modo oscuro se deriva en shell.js.
  color: '#1A1A78',        // barra superior, botones primarios
  colorProfundo: '#12124f',
  fondo: '#F5F0E6',
  logo: '',                // URL de un logo (opcional). Si está vacío se usa el monograma.
  // Supabase del proyecto (cada proyecto tiene el suyo).
  supabase: {
    url: 'https://rrsmeduifzgalmxbaacj.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyc21lZHVpZnpnYWxteGJhYWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzMzNDMsImV4cCI6MjEwODc0OTM0M30.y__Xoz9-M-yUH1WNwoc7Z64-HOYqE2myjFDGYj1qwzc',
    dominio: 'autoclub.local',          // los usuarios son <usuario>@dominio
    admin: 'administracion@autoclub.local'
  },
  // Secciones: aparecen como tarjetas en Inicio y en el menú de abajo. admin:true = solo administración.
  // ruta = carpeta relativa a la raíz del sitio.
  secciones: [
    { id: 'estaciones', titulo: 'Stock por estaciones', corto: 'Stock', ruta: 'estaciones/', icono: 'lista', desc: 'Qué debe haber en cada estación antes de abrir y la producción del día' },
    { id: 'compras',    titulo: 'Compras',    corto: 'Compras',    ruta: 'estaciones/#pedidos', icono: 'carrito', desc: 'Pedidos a proveedores por familia, con cantidad sugerida' },
    { id: 'fichas',     titulo: 'Fichas',     corto: 'Fichas',     ruta: 'fichas/',     icono: 'libro', desc: 'Producción y platos, con cantidades por escala' },
    { id: 'ventas',     titulo: 'Ventas',     corto: 'Ventas',     ruta: 'ventas/',     icono: 'grafico', desc: 'Dashboard de ventas', admin: true },
    { id: 'recepcion',  titulo: 'Recepción',  corto: 'Recepción',  ruta: 'recepcion/',  icono: 'caja', desc: 'Facturas y guías por foto', admin: true }
  ]
};
