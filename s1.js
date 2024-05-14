// Usuarios

function Usuario(nombre, email, clave) {
  this.nombre = nombre;
  this.email = email;
  this.clave = clave;
}

Usuario.usuarios = { administradores: [], clientes: [] };

Usuario.prototype.login = function (email, clave) {
  if (
    email === this.email &&
    clave == this.clave &&
    (Usuario.usuarios.administradores.includes(this) ||
      Usuario.usuarios.clientes.includes(this))
  ) {
    console.log(`${this.nombre} ha ingresado exitosamente`);
    return true;
  } else {
    console.log(
      `Ingreso inválido: usuario ${email} no existe, o email o clave inválidos`
    );
    return false;
  }
};

Usuario.prototype.cambiarClave = function (nuevaClave, login) {
  if (login) {
    this.clave = nuevaClave;
    console.log('Clave cambiada exitosamente');
  } else {
    console.log('Necesita ingresar para poder cambiar su clave');
  }
};

function UsuarioCliente(nombre, email, clave) {
  this.super = Usuario;
  this.super(nombre, email, clave);
  Usuario.usuarios.clientes.push(this);
  this.puntosAcumulados = 0;
}

UsuarioCliente.prototype = Object.create(Usuario.prototype);
UsuarioCliente.prototype.constructor = UsuarioCliente;

UsuarioCliente.prototype.acumularPuntos = function (sumarPuntos) {
  this.puntosAcumulados += sumarPuntos;
  console.log(`Sus puntos acumulados son: ${this.puntosAcumulados}`);
};

UsuarioCliente.prototype.canjearPuntos = function (restarPuntos) {
  this.puntosAcumulados -= restarPuntos;
  console.log(`Sus puntos acumulados son: ${this.puntosAcumulados}`);
};

function UsuarioAdministrador(nombre, email, clave) {
  this.super = Usuario;
  this.super(nombre, email, clave);
  Usuario.usuarios.administradores.push(this);
}

UsuarioAdministrador.prototype = Object.create(Usuario.prototype);
UsuarioAdministrador.prototype.constructor = UsuarioAdministrador;

UsuarioAdministrador.prototype.eliminarUsuario = function (login, email) {
  if (login) {
    if (email == this.email) {
      if (this.puntosAcumulados === undefined) {
        Usuario.usuarios.administradores =
          Usuario.usuarios.administradores.filter((el) => {
            return el !== this;
          });
        console.log(`Usuario ${email} ha sido eliminado exitosamente`);
      } else {
        Usuario.usuarios.clientes = Usuario.usuarios.clientes.filter((el) => {
          return el !== this;
        });
        console.log(`Usuario ${email} ha sido eliminado exitosamente`);
      }
    } else {
      let usuario = Usuario.usuarios.clientes.find((el) => el.email === email);
      if (usuario == undefined) {
        console.log('Sólo se pueden eliminar clientes o a ti mismo.');
      } else {
        usuario = null;
        Usuario.usuarios.clientes = Usuario.usuarios.clientes.filter(
          (item) => item !== null
        );
        console.log(`Usuario ${email} ha sido eliminado exitosamente`);
      }
    }
  } else {
    console.log('Necesitas ingresar primero');
  }
};

UsuarioAdministrador.prototype.agregarProducto = function (
  nombre,
  puntosNecesarios,
  cantidadDisponible,
  stock,
  tipo,
  propiedadEspecifica
) {
  tipo = tipo.toLowerCase();
  let mensaje = `El producto con nombre ${nombre}, puntos necesarios ${puntosNecesarios}, cantidad disponible ${cantidadDisponible}, stock ${stock}`;
  if (tipo[0] == 'd') {
    new ProductoDigital(
      nombre,
      puntosNecesarios,
      cantidadDisponible,
      stock,
      propiedadEspecifica
    );
    mensaje += ` url ${propiedadEspecifica}`;
  } else if (tipo[0] == 'f') {
    new ProductoFisico(
      nombre,
      puntosNecesarios,
      cantidadDisponible,
      stock,
      propiedadEspecifica
    );
    mensaje += ` precio ${propiedadEspecifica}`;
  } else {
    console.log('Tipo de producto inválido');
    return;
  }
  console.log(mensaje + ' ha sido creado exitosamente.');
};

UsuarioAdministrador.prototype.modificarProducto = function (
  producto,
  propiedad,
  nuevoValor
) {
  switch (propiedad) {
    case 'puntosNecesarios':
      producto.puntosNecesarios = nuevoValor;
      break;
    case 'cantidadDisponible':
      producto.cantidadDisponible = nuevoValor;
      break;
    case 'stock':
      producto.stock = nuevoValor;
    case 'url':
      if (producto.url !== undefined) {
        producto.url = nuevoValor;
      } else {
        console.log(
          `El producto ${producto.name} no es un producto digital para tener la propiedad 'url'`
        );
      }
      break;
    case 'precio':
      if (producto.precio !== undefined) {
        producto.precio = nuevoValor;
      } else {
        console.log(
          `El producto ${producto.name} no es un producto físico para tener la propiedad 'precio'`
        );
      }
      break;
    default:
      console.log('Propiedad inválida');
      return;
  }
  console.log(
    `Producto actualizado:${Object.entries(producto).map(([k, v]) => {
      return ` ${k}: ${v}`;
    })}`
  );
};

UsuarioAdministrador.prototype.visualizarUsuarios = function (login) {
  if (login) {
    return Usuario.usuarios;
  } else {
    console.log('Necesitas ingresar primero');
  }
};

// Productos
function Producto(nombre, puntosNecesarios, cantidadDisponible, stock) {
  this.nombre = nombre;
  this.puntosNecesarios = puntosNecesarios;
  this.cantidadDisponible = cantidadDisponible;
  this.stock = stock;
}

Producto.productos = { digitales: [], fisicos: [] };
Producto.visualizarProductos = function () {
  return Producto.productos;
};

Producto.prototype.obtenerInfo = function () {
  return { ...this };
};

function ProductoFisico(
  nombre,
  puntosNecesarios,
  cantidadDisponible,
  stock,
  precio
) {
  this.super = Producto;
  this.super(nombre, puntosNecesarios, cantidadDisponible, stock);
  this.precio = precio;
  Producto.productos.fisicos.push(this);
}

ProductoFisico.prototype = Object.create(Producto.prototype);
ProductoFisico.prototype.constructor = ProductoFisico;

ProductoFisico.prototype.actualizarStock = function (nuevoStock) {
  this.stock = nuevoStock;
  console.log(`El nuevo stock del producto ${this.nombre} es ${this.stock}`);
};

ProductoFisico.prototype.enviarProducto = function (ordenesConfirmadas) {
  if (ordenesConfirmadas.length > 0) {
    ordenesConfirmadas.forEach((el) => {
      if (el === this) console.log('Producto enviado exitosamente');
      return;
    });
  }
  console.log('La orden de canje este producto no ha sido confirmada');
};

function ProductoDigital(
  nombre,
  puntosNecesarios,
  cantidadDisponible,
  stock,
  url
) {
  this.super = Producto;
  this.super(nombre, puntosNecesarios, cantidadDisponible, stock);
  this.url = url;
  Producto.productos.digitales.push(this);
}

ProductoDigital.prototype = Object.create(Producto.prototype);
ProductoDigital.prototype.constructor = ProductoDigital;

ProductoDigital.prototype.descargar = function (usuario, ordenConfirmada) {
  if (
    usuario.login &&
    OrdenCanje.ordenesConfirmadas.includes(ordenConfirmada)
  ) {
    console.log('El producto ha sido descargado exitosamente');
  } else {
    console.log('Necesita ingresar para descargar el producto');
  }
};

ProductoDigital.prototype.obtenerProductoEmail = function (
  usuario,
  ordenConfirmada
) {
  if (
    usuario.login &&
    OrdenCanje.ordenesConfirmadas.includes(ordenConfirmada)
  ) {
    console.log('El producto ha sido enviado a su email exitosamente');
  } else {
    console.log('Necesita ingresar para poder enviar el producto a su email');
  }
};

// Actividad

function Actividad(tipo, puntosOtorgados) {
  this.tipo = tipo;
  this.puntosOtorgados = puntosOtorgados;
  Actividad.actividades.push(this);
  console.log('Actividad', this, 'creada exitosamente');
}

Actividad.actividades = [];

Actividad.prototype.completarActividad = function (usuario) {
  usuario.puntosAcumulados += this.puntosOtorgados;
  console.log(`Sus puntos han sido actualizados: ${usuario.puntosAcumulados}`);
};

Actividad.visualizarActividades = function () {
  if (Actividad.actividades.length > 0) {
    return Actividad.actividades;
  } else {
    return 'No hay actividades creadas aun';
  }
};

// Categoría Producto

function CategoriaProducto(nombre, descripcion, productos) {
  this.nombre = nombre;
  this.descripcion = descripcion;
  this.productos = productos;

  CategoriaProducto.categorias.push(this);
  console.log('Categoria', this, 'creada exitosamente');
}

CategoriaProducto.categorias = [];

CategoriaProducto.listarProductos = function () {
  return CategoriaProducto.categorias;
};

// Orden de canje

function OrdenCanje(usuario, producto, fecha) {
  this.usuario = usuario;
  this.producto = producto;
  this.fecha = fecha;
  OrdenCanje.ordenes.push(this);
  console.log('Orden', this, 'creada exitosamente');
}

OrdenCanje.ordenes = [];
OrdenCanje.ordenesConfirmadas = [];

OrdenCanje.prototype.confirmarOrden = function () {
  if (
    OrdenCanje.ordenes.includes(this) &&
    !OrdenCanje.ordenesConfirmadas.includes(this)
  ) {
    OrdenCanje.ordenesConfirmadas.push(this);
    OrdenCanje.ordenes = OrdenCanje.ordenes.filter((el) => el !== this);
    console.log('Orden', this, 'confirmada exitosamente');
  } else {
    console.log('Orden', this, 'cancelada, confirmada o inexistente');
  }
};

OrdenCanje.prototype.cancelarOrden = function () {
  if (OrdenCanje.ordenesConfirmadas.includes(this)) {
    OrdenCanje.ordenesConfirmadas = OrdenCanje.ordenesConfirmadas.filter(
      (el) => el !== this
    );
  } else {
    OrdenCanje.ordenes = OrdenCanje.ordenes.filter((el) => el !== this);
  }

  console.log('Orden', this, 'cancelada exitosamente');
};

OrdenCanje.visualizarOrdenes = function () {
  return {
    ordenes: OrdenCanje.ordenes,
    confirmadas: OrdenCanje.ordenesConfirmadas,
  };
};

// Pruebas

let cliente1 = new UsuarioCliente('maria gomez', 'maria@email.domain', 1234);
let loginCliente1 = cliente1.login('maria@email.domain', 1234);
cliente1.acumularPuntos(30);
cliente1.canjearPuntos(10);

let admin1 = new UsuarioAdministrador(
  'isabela ortega',
  'isabela@email.com',
  1234
);
let loginAdmin1 = admin1.login('isabela@email.com', 1234);

let admin2 = new UsuarioAdministrador('pepito perez', 'pepito@email.com', 1234);
let loginAdmin2 = admin2.login('pepito@email.com', 1234);
admin2.cambiarClave(2345, loginAdmin2);
loginAdmin2 = admin2.login('pepito@email.com', 2345);

admin2.eliminarUsuario(loginAdmin2, 'pepito@email.com');
admin2.login('pepito@email.com', 2345);

admin1.agregarProducto('pastel', 20, 15, 100, 'digital', 'pastel.jpg');
admin1.agregarProducto('gato', 30, 20, 3500, 'fisico', 3500);

admin1.modificarProducto(
  {
    nombre: 'pastel',
    puntosNecesarios: 20,
    cantidadDisponible: 15,
    stock: 100,
    url: 'pastel.jpg',
  },
  'url',
  'pastelito.jpg'
);

console.log(`Usuarios:`, admin1.visualizarUsuarios(loginAdmin1));

let actividad1 = new Actividad('hacer encuesta', 200);
actividad1.completarActividad(cliente1);

let actividad2 = new Actividad('jugar LoL', -300);
console.log(Actividad.visualizarActividades());

console.log(`Productos:`, Producto.visualizarProductos());

let productoFisico1 = new ProductoFisico('gatito', 20, 30, 100, 300);
console.log('Info producto fisico 1:', productoFisico1.obtenerInfo());
productoFisico1.actualizarStock(200);

let productoDigital1 = new ProductoDigital(
  'sticker de iron man',
  25,
  50,
  100,
  'sticker-iron-man.jpg'
);

let categoria1 = new CategoriaProducto(
  'entretenimiento',
  'productos de entretenimiento',
  [productoFisico1, productoDigital1]
);

console.log('Lista de categorias:', CategoriaProducto.listarProductos());

let orden1 = new OrdenCanje(cliente1, productoDigital1, new Date());
let orden2 = new OrdenCanje(cliente1, productoFisico1, new Date());

orden1.confirmarOrden();
orden2.cancelarOrden();
console.log(OrdenCanje.visualizarOrdenes());
