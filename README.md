<p align="center">
<img src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/huertohogarlogoconfondo.png" width="300" alt="HuertoHogar Logo"/>
</p>

<h1 align="center">HuertoHogar </h1>

<p align="center">
<b>Asignatura:</b> Desarrollo Fullstack II (DSY1104) · <b>Duoc UC</b>





<b>Autores:</b> Matias Guzman, Felipe Quezada y Danilo Celis
</p>

<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-19.2-61DAFB%3Flogo%3Dreact%26logoColor%3Dblack" alt="React Version"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Bootstrap-5.3-7952B3%3Flogo%3Dbootstrap%26logoColor%3Dwhite" alt="Bootstrap Version"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-18%2B-339933%3Flogo%3Dnode.js%26logoColor%3Dwhite" alt="Node.js Version"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Arquitectura-Microservicios-FF9800" alt="Arquitectura Microservicios"/>
<img src="https://img.shields.io/badge/Licencia-MIT-00C853?logo=open-source-initiative&logoColor=white" alt="Licencia MIT"/>
</p>

Descripción General

HuertoHogar es una plataforma web E-commerce fullstack, desarrollada como proyecto académico para la asignatura Desarrollo Fullstack II en Duoc UC. El objetivo principal es conectar a las familias chilenas con productos agrícolas frescos, ofreciendo una experiencia de compra digital moderna, rápida y segura.

El frontend fue construido utilizando React y Bootstrap, implementando una arquitectura basada en componentes y consumiendo una API REST distribuida en microservicios (Spring Boot). El sistema permite a los usuarios navegar por un catálogo, gestionar un carrito de compras, registrarse/autenticarse y realizar pedidos, además de contar con un panel de administración completo.

 Funcionalidades Implementadas

🛒Experiencia de Cliente

Catálogo Interactivo: Visualización de productos con filtros por categoría y búsqueda en tiempo real.

Carrito de Compras Inteligente:

Gestión de stock en tiempo real (evita añadir más de lo disponible).

Cálculo automático de totales y costos de envío.

Persistencia de datos en localStorage para no perder el carrito al recargar.

Proceso de Pago (Checkout): Flujo de compra integrado con validación de sesión y confirmación visual mediante Modals.

Autenticación Segura: Registro y Login conectados al microservicio de usuarios mediante JWT.

Panel de Administración (Rol: ADMIN)

Gestión de Productos: CRUD completo (Crear, Leer, Actualizar, Eliminar) conectado al microservicio de Catálogo.

Gestión de Usuarios: Administración de cuentas y roles (Admin, Cliente, Vendedor).

Gestión de Pedidos: Visualización de órdenes de compra y actualización de estados ("Pendiente" → "En camino" → "Completado").

Dashboard: Vista protegida accesible solo para usuarios con rol de Administrador.

Diseño y UX

Responsive Design: Interfaz totalmente adaptativa para móviles, tablets y escritorio usando Bootstrap Grid.

Feedback Visual: Sistema de notificaciones (Toasts) para acciones como "Agregado al carrito", "Error de login" o "Pedido exitoso".

Navegación SPA: Uso de react-router-dom para una navegación fluida sin recargas de página.

Stack Tecnológico

Lenguaje: JavaScript (ES6+)

Framework: React 19

Estilos: Bootstrap 5 (React-Bootstrap) + CSS personalizado

Enrutamiento: React Router v7

Estado Global: Context API (AuthContext, CartContext, ProductContext)

Comunicación HTTP: Fetch API con servicio centralizado (apiService.js)

Arquitectura: Integración con Microservicios (Usuarios, Catálogo, Pedidos)

 Estructura del Proyecto

El código sigue una estructura modular para facilitar la escalabilidad:

src/
├── components/      # Componentes reutilizables (Navbar, Footer, ProductCard, Modals)
├── context/         # Estado global (AuthContext, CartContext, ProductContext)
├── hooks/           # Custom Hooks (useDocumentTitle, etc.)
├── pages/           # Vistas principales (HomePage, CartPage, AdminPage, etc.)
├── services/        # Lógica de comunicación con API (apiService.js)
├── App.js           # Configuración de rutas y lógica principal
└── index.js         # Punto de entrada
