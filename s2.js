// Plato

function Plato(nombre, precio, ingredientes) {
  this.nombre = nombre;
  this.precio = precio;
  this.ingredientes = ingredientes;

  console.log('Plato', this, 'creado exitosamente');
}

Plato.prototype.obtenerInfo = function () {
  return this;
};

// Menu

function Menu(platos) {
  this.platos = platos;

  console.log('Menu', this, 'creado exitosamente');
}

Menu.prototype.visualizar = function () {
  return this.platos;
};

function MenuFisico(platos) {
  this.super = Menu;
  this.super(platos);
  console.log('Menu', this, 'creado exitosamente');
}

MenuFisico.prototype = Object.create(Menu.prototype);
MenuFisico.prototype.constructor = MenuFisico;

MenuFisico.prototype.imprimir = function () {
  return this.platos;
};

function MenuQr(url, platos) {
  this.super = Menu;
  this.super(platos);
  this.url = url;

  console.log('Menu digital', this, 'creado exitosamente');
}

MenuQr.prototype = Object.create(Menu.prototype);
MenuQr.prototype.constructor = MenuQr;

MenuQr.prototype.generarQr = function () {
  return this.url;
};

// Restaurante

function Restaurante(nombre, menu) {
  this.nombre = nombre;
  this.menu = menu;

  console.log('Restaurante', this, 'creado exitosamente');
}

Restaurante.restaurantes = { fisicos: [], digitales: [] };

Restaurante.prototype.agregarPlato = function (plato) {
  this.menu.platos.push(plato);
  console.log('Plato', plato, 'agregado exitosamente');
};

Restaurante.prototype.actualizarPlato = function (plato, propiedad, valor) {
  if (this.menu.platos.includes(plato)) {
    switch (propiedad) {
      case 'nombre':
        plato.nombre = valor;
        break;
      case 'precio':
        plato.precio = valor;
        break;
      case 'ingredientes':
        plato.ingredientes = valor;
        break;
      default:
        console.log('Propiedad inválida');
        return;
    }
    console.log('Plato actualizado:', plato);
  } else {
    console.log('El plato', plato, 'no está en el menú');
  }
};

Restaurante.prototype.eliminarPlato = function (plato) {
  this.platos = this.menu.platos.filter((el) => el !== plato);
  console.log('Plato', plato, 'eliminado exitosamente');
};

function RestuaranteFisico(nombre, menu, direccion) {
  this.super = Restaurante;
  this.super(nombre, menu);
  this.direccion = direccion;

  Restaurante.restaurantes.fisicos.push(this);
  console.log('Restaurante fisico', this, 'creado exitosamente');
}

RestuaranteFisico.prototype = Object.create(Restaurante.prototype);
RestuaranteFisico.prototype.constructor = RestuaranteFisico;

function RestauranteDigital(nombre, menu) {
  this.super = Restaurante;
  this.super(nombre, menu);

  Restaurante.restaurantes.digitales.push(this);
  console.log('Restaurante digital', this, 'creado exitosamente');
}

RestauranteDigital.prototype = Object.create(Restaurante.prototype);
RestauranteDigital.prototype.constructor = RestauranteDigital;

// Pedido

function Pedido(cliente, restaurante, detalles, platos) {
  this.cliente = cliente;
  this.restaurante = restaurante;
  this.detalles = detalles;
  this.estado = 'pendiente';
  this.platos = platos;

  Pedido.pedidos.push(this);
}

Pedido.pedidos = [];

Pedido.prototype.actualizarEstado = function (nuevoEstado) {
  this.estado = nuevoEstado;

  console.log(`Estado actualizado: ${this.estado}`);
};

Pedido.prototype.calcularTotal = function () {
  let total = 0;
  this.platos.array.forEach((el) => {
    total += el.precio;
  });

  console.log(`El total de su pedido es: ${total}`);
};

// Usuario

function Usuario(nombre, email, clave) {
  this.nombre = nombre;
  this.email = email;
  this.clave = clave;
}

Usuario.usuarios = { clientes: [], repartidores: [] };

Usuario.prototype.autenticacion = function (email, clave) {
  if (email === this.email && clave === this.clave) {
    console.log('Usuario', this, 'ha sido autenticado exitosamente');
    return true;
  } else {
    console.log('Autenticación fallida');
    return false;
  }
};

function Cliente(nombre, email, clave, direccion, telefono) {
  this.super = Usuario;
  this.super(nombre, email, clave);
  this.direccion = direccion;
  this.telefono = telefono;
  this.pedidos = [];

  Usuario.usuarios.clientes.push(this);
  console.log('Cliente', this, 'creado exitosamente');
}

Cliente.prototype = Object.create(Usuario.prototype);
Cliente.prototype.constructor = Cliente;

Cliente.prototype.realizarPedido = function (
  login,
  restaurante,
  detalles,
  platos
) {
  if (login) {
    if (
      Restaurante.restaurantes.fisicos.includes(restaurante) ||
      Restaurante.restaurantes.digitales.includes(restaurante)
    ) {
      let verificar = true;
      let platosIncorrectos = [];

      platos.forEach((el) => {
        if (!restaurante.menu.platos.includes(el)) {
          verificar = false;
          platosIncorrectos.push(el);
        }
      });

      if (!verificar) {
        console.log(
          'Los platos que no están en el restaurante son:',
          platosIncorrectos
        );
      } else {
        let pedido = new Pedido(this, restaurante, detalles, platos);
        this.pedidos.push(pedido);
        console.log('Pedido', pedido, 'creado exitosamente');
      }
    } else {
      console.log('El restaurante no existe');
    }
  } else {
    console.log('Necesitas ingresar primero');
  }
};

Cliente.prototype.verHistorialPedidos = function (login) {
  if (login) {
    return this.pedidos;
  } else {
    console.log('Necesitas ingresar primero');
  }
};

function Repartidor(nombre, email, clave, vehiculo, ubicacion) {
  this.super = Usuario;
  this.super(nombre, email, clave);
  this.vehiculo = vehiculo;
  this.disponible = true;
  this.ubicacion = ubicacion;

  console.log('Repartidor', this, 'creado exitosamente');
}

Repartidor.prototype = Object.create(Usuario.prototype);
Repartidor.prototype.constructor = Repartidor;

Repartidor.prototype.aceptarPedido = function (pedido) {
  pedido.estado = 'aceptado';
  this.disponible = false;
  console.log('Pedido', pedido, 'aceptado');
};

Repartidor.prototype.actualizarUbicacion = function (nuevaUbicacion) {
  this.ubicacion = nuevaUbicacion;
  console.log(`Su ubación ha sido cambiada a ${this.ubicacion}`);
};

Repartidor.prototype.completarEntrega = function (pedido) {
  pedido.estado = 'completado';
  Pedido.pedidos = Pedido.pedidos.filter((el) => el !== pedido);
  this.disponible = true;
  console.log('Pedido completado, disponibilidad actualizada');
};

Repartidor.prototype.actualizarDisponibilidad = function (valor) {
  this.disponible = valor;
  console.log(`Disponibilidad cambiada a ${this.disponible}`);
};

// Pruebas

let plato1 = new Plato('salchipapas', 200, ['papas', 'salsas', 'salchichas']);
console.log('Información plato 1:', plato1.obtenerInfo());

let plato2 = new Plato('hamburguesa', 500, [
  'pan',
  'carne',
  'lechuga',
  'tomate',
  'cebolla',
  'salsas',
]);

let plato3 = new Plato('perro', 300, [
  'pan',
  'salchicha',
  'salsas',
  'adiciones',
]);

let menuFisico1 = new MenuFisico([plato1, plato2]);
console.log('visualización menú físico 1:', menuFisico1.visualizar());
console.log('menu fisico 1 imprimir: ', menuFisico1.imprimir());

let menuDigital1 = new MenuQr('menu-qr-1.com', [plato2]);
console.log('visualización menú digital 1:', menuDigital1.visualizar());
console.log('generar qr menú digital 1:', menuDigital1.generarQr());

let restauranteFisico1 = new RestuaranteFisico(
  'Restaurante Fisico',
  menuFisico1,
  'direccion del restaurante'
);

restauranteFisico1.agregarPlato(plato3);
restauranteFisico1.actualizarPlato(plato1, 'precio', 500);
restauranteFisico1.eliminarPlato(plato2);

let restauranteDigital1 = new RestauranteDigital(
  'Restaurante digital',
  menuDigital1
);
restauranteDigital1.actualizarPlato(plato1, 'nombre', 'uwu');

console.log('Restaurantes:', Restaurante.restaurantes);

let cliente1 = new Cliente(
  'Pepito Perez',
  'pepito.perez@email.domain',
  12345,
  'direccion de pepito',
  55155454
);

let loginCLiente1 = cliente1.autenticacion('pepito.perez@email.domain', 12345);
cliente1.realizarPedido(loginCLiente1, restauranteFisico1, 'uwuwuwuwu', [
  plato1,
  plato1,
  plato1,
]);

cliente1.realizarPedido(loginCLiente1, restauranteDigital1, 'awa', [
  plato2,
  plato2,
]);
console.log(
  'Historial pedidos cliente1:',
  cliente1.verHistorialPedidos(loginCLiente1)
);

console.log('Pedidos existentes:', Pedido.pedidos);

let repartidor = new Repartidor(
  'iron man',
  'iron.man@email.domain',
  1234,
  'traje',
  'su casita'
);

repartidor.aceptarPedido(Pedido.pedidos[0]);
repartidor.actualizarUbicacion('casa de pepito');
repartidor.completarEntrega(Pedido.pedidos[0]);
repartidor.actualizarDisponibilidad(false);
//console.log('Usuarios existentes:', Usuario.usuarios);
