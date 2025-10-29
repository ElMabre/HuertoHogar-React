<p align="center">
<img src="https://raw.githubusercontent.com/ElMabre/ProyectoHuertoHogar/refs/heads/main/img/huertohogarlogoconfondo.png" width="300" alt="HuertoHogar Logo"/>
</p>

<h1 align="center">HuertoHogar – Aplicación Móvil Android</h1>

<p align="center">
<b>Asignatura:</b> Desarrollo de Aplicaciones Móviles (DSY1105) · <b>Duoc UC</b>



<b>Autores:</b> Matias Guzman, Felipe Quezada y Danilo Celis
</p>

<p align="center">
<img src="https://img.shields.io/badge/Android_Studio-Iguana_|_2023.2.1-3DDC84?logo=androidstudio&logoColor=white" alt="Android Studio Version"/>
<img src="https://img.shields.io/badge/Kotlin-1.9+-7F52FF?logo=kotlin&logoColor=white" alt="Kotlin Version"/>
<img src="https://img.shields.io/badge/Jetpack_Compose-Material_3-4285F4?logo=android&logoColor=white" alt="Jetpack Compose Material 3"/>
<img src="https://img.shields.io/badge/Arquitectura-MVVM-FF9800" alt="Arquitectura MVVM"/>
<img src="https://img.shields.io/badge/Licencia-MIT-00C853?logo=open-source-initiative&logoColor=white" alt="Licencia MIT"/>
</p>

Descripción General

HuertoHogar es una aplicación móvil Android nativa, desarrollada como proyecto académico para la asignatura Desarrollo de Aplicaciones Móviles (DSY1105) en Duoc UC. El objetivo principal es ofrecer una plataforma moderna e intuitiva para la adquisición de productos agrícolas frescos directamente desde el campo.

La aplicación permite a los usuarios explorar un catálogo digital, gestionar un carrito de compras virtual y administrar su perfil personal, incluyendo la personalización de la imagen de usuario. Fue desarrollada íntegramente en Kotlin, utilizando Jetpack Compose para la interfaz de usuario y siguiendo el patrón arquitectónico MVVM (Model-View-ViewModel) para asegurar un diseño modular, mantenible y escalable.

Funcionalidades Implementadas

A continuación se detallan las funcionalidades clave incorporadas en la aplicación:

Autenticación de Usuarios:

Flujo completo de Inicio de Sesión y Registro.

Validación en tiempo real de campos (formato de email, longitud de contraseña, formato de RUN chileno, aceptación de términos).

Persistencia segura de la sesión del usuario (email) mediante DataStore Preferences.

Catálogo y Carrito de Compras:

Pantalla Principal (HomeScreen): Muestra productos destacados utilizando LazyRow para una navegación horizontal eficiente.

Catálogo Completo (ProductsScreen): Presenta todos los productos disponibles en una cuadrícula adaptable (LazyVerticalGrid) que ajusta el número de columnas según el tamaño de pantalla.

Detalle de Producto (ProductDetailScreen): Ofrece información extendida del producto seleccionado (imagen, descripción, origen, precio unitario, stock disponible) y permite añadirlo al carrito.

Gestión del Carrito: Implementado con un CartViewModel compartido y CartUiState, permite añadir, eliminar, actualizar cantidad (botones +/-) y vaciar el carrito.

Feedback Visual: Se incluye un contador de ítems (BadgedBox) en la barra de navegación superior y una pantalla de resumen (CartScreen).

Perfil de Usuario (ProfileScreen):

Muestra el email del usuario autenticado, obtenido de forma reactiva desde DataStore.

Permite al usuario seleccionar una imagen de la galería o capturar una nueva foto con la cámara del dispositivo, utilizando Activity Result APIs.

Implementa la solicitud y manejo de permisos necesarios (específicamente CAMERA).

Utiliza FileProvider y almacenamiento interno para el manejo seguro de archivos temporales de la cámara, previniendo errores y siguiendo las directrices de seguridad de Android.

La imagen de perfil seleccionada persiste visualmente al navegar entre pantallas y se muestra en la barra superior.

Incluye funcionalidad de Cierre de Sesión, que elimina los datos de sesión de DataStore y redirige al usuario a la pantalla de Login, limpiando la pila de navegación.

Experiencia de Usuario:

Se incorporaron indicadores de carga (CircularProgressIndicator) en los botones de Login y Registro durante las operaciones asíncronas para proveer retroalimentación visual.

La navegación entre pantallas se gestiona mediante Navigation Compose, asegurando transiciones fluidas.

El manejo de estado se realiza de forma reactiva con Kotlin Coroutines y StateFlow.

Stack Tecnológico

Lenguaje: Kotlin

UI Framework: Jetpack Compose (con componentes de Material 3)

Arquitectura: MVVM (Model-View-ViewModel)

Navegación: Navigation Compose

Asincronía / Estado: Kotlin Coroutines, StateFlow

Persistencia Local: DataStore Preferences

Carga de Imágenes: Coil

Hardware / OS: Activity Result APIs (Cámara, Galería, Permisos), FileProvider

Sistema de Build: Gradle (con Version Catalog - libs.versions.toml)

Estructura del Proyecto

El código fuente está organizado siguiendo las convenciones de MVVM para facilitar la comprensión y el mantenimiento:

├── data/
│   └── local/        # Componentes de acceso a datos locales (e.g., SessionManager)
├── model/            # Clases de datos y estados de UI (Producto, CartUiState, etc.)
├── navigation/       # Definición de rutas (AppScreens) y configuración de NavHost (AppNavigation)
├── ui/
│   ├── components/   # Componentes Composable reutilizables (ProductCard, etc.)
│   ├── screens/      # Componentes Composable para cada pantalla (LoginScreen, HomeScreen, etc.)
│   └── theme/        # Definición del tema visual (Color.kt, Type.kt, Theme.kt)
└── viewmodel/        # Clases ViewModel que encapsulan la lógica de presentación



Guía de Inicio Rápido

Requisitos Previos

Android Studio | 2023.2.1 o una versión superior.

Java Development Kit (JDK) 11 o superior.

Dispositivo físico o emulador Android con API nivel 26 (Android 8.0 Oreo) o superior.

Pasos para Ejecutar

Clonar el Repositorio:

git clone [https://github.com/ElMabre/HuertoHogarApp.git](https://github.com/ElMabre/HuertoHogarApp.git)
cd HuertoHogarApp


Abrir el Proyecto:

Inicia Android Studio.

Selecciona File > Open... y navega hasta la carpeta HuertoHogarApp clonada.

Sincronizar Gradle:

Espera a que Android Studio indexe los archivos y descargue todas las dependencias especificadas en los archivos Gradle. Puede que necesites hacer clic en Sync Project with Gradle Files (icono de elefante con flecha) si no se inicia automáticamente.

Seleccionar Dispositivo:

Elige un dispositivo de ejecución (emulador previamente configurado o un dispositivo físico conectado y habilitado para depuración USB) en la barra de herramientas superior.

Ejecutar la Aplicación:

Haz clic en el botón Run 'app' o presiona Shift + F10.
