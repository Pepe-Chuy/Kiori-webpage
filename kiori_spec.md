# Kiori — Especificación Técnica Completa
> Documento de contexto para implementación. Generado a partir de sesión de planeación.  
> Versión: 1.0 | Estado: Listo para implementación con pendientes marcados como `[TBD]`

---

## 1. Descripción General del Proyecto

**Nombre:** Kiori  
**Slogan:** "Energía que inspira"  
**Tipo:** Tienda de bienestar (wellness shop) con suscripción, tienda individual y clases en línea  
**Idioma del sitio:** Español (todo el texto visible para usuario y administrador en español)  
**Idioma del código:** Comentarios en español, nombres de variables/funciones/archivos en inglés  
**Despliegue:** Vercel  
**Dominio:** Propio (configuración pendiente en Vercel)  

### Propósito del sitio
Kiori tiene tres pilares de negocio:

1. **Suscripción mensual:** El usuario llena un formulario de preferencias. El sistema sugiere un paquete personalizado que se envía mensualmente. Los suscriptores reciben beneficios adicionales.
2. **Tienda individual:** Todos los usuarios con cuenta pueden comprar productos sueltos. Los suscriptores reciben envío gratis bajo condiciones específicas.
3. **Clases en línea:** Yoga, barre y otras disciplinas. Solo accesibles para suscriptores activos. Incluye clases en vivo y contenido grabado almacenado.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript (TSX) |
| Base de datos | MongoDB con Mongoose (ODM) |
| Autenticación | NextAuth.js (Auth.js) — email/contraseña + Google OAuth |
| Pagos | Stripe Subscriptions |
| Almacenamiento de imágenes | Cloudinary (plan gratuito, suficiente para < 100 productos) |
| Animaciones | GSAP con ScrollTrigger |
| Clases en línea | YouTube (embeds no listados, modo privacy-enhanced) |
| Envíos | Envía.com API (credenciales `[TBD]`) |
| Estilos | Un único archivo global de CSS con variables CSS (ver sección 3) |
| Despliegue | Vercel |
| Conexión DB | Mongoose conectado a MongoDB Atlas vía variables de entorno en Vercel |

### Reglas de arquitectura
- Toda la lógica de negocio sensible vive en **Next.js API Routes** (`/app/api/...`), nunca en el cliente.
- El cliente nunca accede directamente a la base de datos.
- Las claves de API (Stripe, Cloudinary, MongoDB, NextAuth, Envía.com) se manejan exclusivamente como variables de entorno de Vercel.
- Los embeds de YouTube usan el dominio `www.youtube-nocookie.com` para privacy-enhanced mode. El usuario ve el video dentro de la plataforma sin acceso directo a la URL de YouTube.

---

## 3. Estilo y Diseño

### Tipografías
- **Futura Std Bold** — títulos y encabezados
- **Futura Std Heavy** — énfasis y slogan
- Futura Std es una fuente comercial. Los archivos `.woff2` serán provistos por el cliente y se servirán como fuentes auto-hospedadas (`@font-face` en el archivo global de estilos). `[PENDIENTE: recibir archivos de fuente]`

### Paleta de colores

| Nombre | Hex |
|---|---|
| Verde salvia | `#3F5B5A` |
| Rosa palo | `#D8B1AB` |
| Blanco rosado | `#EDE6E9` |
| Nude arena | `#B6907E` |
| Gris pálido | `#C8C8C8` |
| Blanco puro | `#FFFFFF` |
| Negro/texto | `#1A1A1A` |

### Archivo de estilos
- Existe un único archivo `globals.css` en la raíz del proyecto.
- Todas las variables de color, tipografía, espaciado y breakpoints se definen como variables CSS en `:root`.
- Ningún componente define colores o fuentes con valores hardcoded; siempre usan variables.
- Se usa Tailwind CSS como utilitario, pero el archivo de configuración (`tailwind.config.ts`) apunta a las mismas variables para mantener consistencia.

### Diseño responsivo
- Diseñado para escritorio y móvil.
- Breakpoint principal: `768px` (mobile-first approach).
- En móvil, las animaciones de scroll se simplifican: solo fade-in al entrar en viewport (sin animaciones direccionales).

### Logo
- El cliente proveerá el archivo SVG/PNG con fondo transparente. `[PENDIENTE: recibir logo]`
- Se usa en: navbar, footer, y hero de landing page.

---

## 4. Rutas y Páginas

### Rutas públicas (sin sesión)
| Ruta | Descripción |
|---|---|
| `/` | Landing page con 4 secciones animadas |
| `/suscripcion` | Planes, precios y beneficios de suscripción |
| `/iniciar-sesion` | Login con email/contraseña o Google OAuth |
| `/registrarse` | Registro de nueva cuenta |

### Rutas protegidas (requieren sesión — cualquier usuario)
| Ruta | Descripción |
|---|---|
| `/tienda` | Catálogo de productos con modal de detalle |
| `/tienda/carrito` | Carrito de compras y checkout |
| `/perfil` | Datos personales, historial, formulario de preferencias, Puntos Kiori |

### Rutas protegidas (requieren suscripción activa)
| Ruta | Descripción |
|---|---|
| `/clases` | Catálogo de clases publicadas (en vivo y grabadas) |

### Rutas de administración (requieren rol `admin`)
| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard principal del administrador |
| `/admin/pedidos` | Gestión de pedidos de tienda |
| `/admin/paquetes` | Gestión de cajas mensuales de suscripción |
| `/admin/usuarios` | Gestión de usuarios y Puntos Kiori |
| `/admin/productos` | Gestión de productos (crear, editar, restockear, eliminar) |
| `/admin/clases` | Gestión de clases (publicar, ocultar, eliminar) |
| `/admin/devoluciones` | Gestión de solicitudes de devolución |

---

## 5. Modelos de Base de Datos (Mongoose)

### User
```js
{
  name: String,                       // nombre completo
  email: String,                      // único, requerido
  password: String,                   // hash bcrypt (null si usa Google OAuth)
  provider: String,                   // 'credentials' | 'google'
  role: String,                       // 'user' | 'admin'  (default: 'user')
  location: String,                   // ciudad/estado
  gender: String,
  age: Number,
  preferenceForm: Object,             // respuestas al formulario [TBD estructura]
  puntosKiori: Number,                // saldo de moneda virtual (default: 0)
  referralCode: String,               // formato KIORI-XXXXX, único, generado al crear cuenta
  referredBy: ObjectId,              // ref: User (quien lo recomendó)
  referralRewardGranted: Boolean,     // si ya se otorgó el reward al referrer
  referralsThisMonth: Number,         // contador de referidos activos este mes (max 2)
  referralsMonthReset: Date,          // fecha del último reset (1ro de cada mes)
  subscriptionId: String,             // ID de suscripción en Stripe
  subscriptionStatus: String,         // 'active' | 'canceled' | 'paused' | 'none'
  subscriptionTier: String,           // 'mensual' | 'trimestral' | 'anual' | null
  subscriptionEnd: Date,              // fecha de fin del periodo pagado
  createdAt: Date
}
```

### Product
```js
{
  name: String,
  description: String,
  price: Number,                      // en MXN
  categories: [String],              // múltiples categorías permitidas
  quantity: Number,                   // stock disponible
  imageUrl: String,                   // URL de Cloudinary
  isActive: Boolean,                  // true = visible en tienda
  createdAt: Date
}
```

### Order
```js
{
  user: ObjectId,                     // ref: User
  items: [
    {
      product: ObjectId,              // ref: Product
      quantity: Number,
      priceAtPurchase: Number         // precio al momento de compra
    }
  ],
  subtotal: Number,
  deliveryFee: Number,               // 0 si va con paquete mensual
  puntosUsed: Number,                // Puntos Kiori aplicados como descuento
  total: Number,
  deliveryOption: String,            // 'ahora' | 'con-paquete'
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  trackingNumber: String,            // proporcionado por Envía.com
  status: String,                    // 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  stripePaymentId: String,
  createdAt: Date
}
```

### Package (caja mensual de suscripción)
```js
{
  user: ObjectId,                     // ref: User
  month: String,                      // formato 'YYYY-MM'
  items: [
    {
      product: ObjectId,
      quantity: Number
    }
  ],
  recommendedBy: String,              // 'system' (generado por lógica de preferencias)
  status: String,                     // 'pendiente' | 'empacando' | 'enviado' | 'entregado'
  trackingNumber: String,
  shippedAt: Date,
  createdAt: Date
}
```

### Return
```js
{
  order: ObjectId,                    // ref: Order
  user: ObjectId,                     // ref: User
  reason: String,                     // descripción del usuario
  status: String,                     // 'pendiente' | 'aprobada' | 'rechazada'
  resolution: String,                 // 'reenvio' | 'puntos' (elegido por admin)
  adminNotes: String,
  resolvedAt: Date,
  createdAt: Date
}
```

### Class
```js
{
  title: String,
  description: String,
  youtubeVideoId: String,            // ID del video (no la URL completa)
  type: String,                       // 'en-vivo' | 'grabada'
  isPublished: Boolean,
  publishedAt: Date,
  instructor: String,
  durationMinutes: Number,
  category: String,                   // 'yoga' | 'barre' | 'meditacion' | etc.
  createdAt: Date
}
```

### Referral (log de recompensas otorgadas)
```js
{
  referrer: ObjectId,                 // ref: User — quien refirió
  referred: ObjectId,                 // ref: User — quien fue referido
  puntosAwarded: Number,             // 150 MXN en Puntos Kiori
  triggerType: String,               // 'compra' | 'suscripcion'
  awardedAt: Date
}
```

---

## 6. Autenticación

- **Proveedor:** NextAuth.js (Auth.js v5)
- **Métodos:** Email + contraseña (CredentialsProvider) y Google OAuth
- **Sesión:** JWT strategy
- **Registro:** Siempre requiere cuenta para comprar. Los visitantes pueden navegar la landing, `/suscripcion` y explorar la tienda, pero el carrito y checkout requieren sesión.
- **Roles:** `user` y `admin`. El rol `admin` protege todas las rutas `/admin/*` con middleware de Next.js.
- **Contraseña:** Hash con bcrypt antes de guardar en MongoDB.
- **Al registrarse:** Se genera automáticamente un `referralCode` único con formato `KIORI-XXXXX` (5 caracteres alfanuméricos aleatorios en mayúsculas).
- **OAuth Google:** Si el usuario se registra con Google, el campo `password` queda en `null` y `provider` es `'google'`.

---

## 7. Módulo: Tienda (Tienda)

### Vista general
- Cuadrícula de productos con filtros por categoría.
- Categorías: 6 en total `[TBD: nombres definitivos]`. Para desarrollo/mock se usan 6 categorías y 30 productos.
- Al hacer clic en un producto se abre un **modal** (no página separada) con: nombre, descripción, precio, categorías, imagen y botón "Agregar al carrito".

### Carrito y Checkout
1. El usuario agrega productos al carrito.
2. Ingresa su dirección de envío.
3. El sistema calcula el costo de envío vía **Envía.com API** `[TBD: confirmar si es cálculo en tiempo real por zona o tarifa fija]`.
4. El usuario puede aplicar **Puntos Kiori** como descuento (se muestran como tokens, cada punto equivale a $1 MXN).
5. Si el usuario es suscriptor activo:
   - Aparece la opción: **"Enviar ahora"** (con costo de envío) o **"Enviar con mi paquete mensual"** (sin costo de envío).
   - Si el paquete del mes ya fue enviado, la opción "con paquete" automáticamente programa la entrega para el próximo paquete mensual y se informa al usuario.
6. El pago se procesa con **Stripe** (pago único por compra individual).
7. Al confirmar el pago, se genera un `Order` en la base de datos.

### Reglas de envío
| Tipo de usuario | Condición | Costo de envío |
|---|---|---|
| Usuario sin suscripción | Siempre | Tarifa Envía.com |
| Suscriptor activo | Envío con paquete mensual | Gratis |
| Suscriptor activo | Envío ahora (separado) | Tarifa Envía.com |

### Devoluciones
- El usuario solicita una devolución desde su perfil (`/perfil` → historial de pedidos → solicitar devolución).
- El formulario incluye motivo.
- El admin revisa en `/admin/devoluciones` y puede **aprobar** o **rechazar**.
- Si aprueba, elige la resolución: **reenvío del mismo artículo** o **abono en Puntos Kiori**.
- El usuario recibe una **notificación por email** con la resolución.

---

## 8. Módulo: Suscripción

### Niveles
| Nivel | Nombre | Precio | Estado |
|---|---|---|---|
| Sin cuenta | Visitante | — | Solo puede navegar landing y `/suscripcion` |
| Con cuenta, sin suscripción | Usuario | Gratis | Puede comprar en tienda con costo de envío |
| Con suscripción activa | Suscriptor Premium | `[TBD]` | Acceso a clases, caja mensual, envío gratis con paquete |

### Planes de pago (todos incluyen los mismos beneficios)
| Plan | Facturación | Precio |
|---|---|---|
| Mensual | Cada mes | `[TBD]` |
| Trimestral | Cada 3 meses | `[TBD]` |
| Anual | Cada año | `[TBD]` |

> Los tres planes entregan **una caja mensual** independientemente del ciclo de facturación. El plan trimestral/anual solo cambia la frecuencia del cobro, no de la entrega.

### Implementación con Stripe
- Se usan **Stripe Subscriptions** (no cargos manuales).
- Stripe maneja cobros recurrentes, facturas, fallos de pago y cancelaciones.
- Los webhooks de Stripe actualizan el estado de suscripción del usuario en MongoDB.

### Cancelación
- El usuario puede cancelar desde `/perfil`.
- Debe existir un paso de **confirmación** ("¿Seguro que deseas cancelar? Seguirás teniendo acceso hasta [fecha fin]") antes de ejecutar la cancelación.
- Al cancelar: el usuario **mantiene acceso hasta el fin del periodo pagado**, luego el status cambia a `'canceled'` y pierde acceso a clases y caja mensual.
- La cancelación se ejecuta en Stripe y el webhook actualiza MongoDB.

### Formulario de preferencias
- El usuario llena el formulario al suscribirse (y puede editarlo desde `/perfil`).
- Preguntas: mayormente opción múltiple. `[TBD: listado de preguntas y opciones]`
- La lógica de recomendación de productos para la caja mensual es definida por la administradora. `[TBD: reglas de mapeo preferencias → productos]`
- El sistema sugiere el contenido del paquete. La admin lo revisa en `/admin/paquetes` y lo prepara físicamente.

---

## 9. Módulo: Clases

### Acceso
- Solo suscriptores activos (`subscriptionStatus === 'active'`) pueden acceder a `/clases`.
- Si un usuario sin suscripción intenta acceder, se redirige a `/suscripcion`.

### Tipos de clase
| Tipo | Descripción |
|---|---|
| En vivo | Transmitida en YouTube Live (URL no listada) |
| Grabada | Video de YouTube no listado, almacenado en la plataforma |

### Embed de YouTube
- Se guarda únicamente el **YouTube Video ID** en la base de datos, no la URL completa.
- El embed se construye en el servidor con `www.youtube-nocookie.com/embed/{videoId}`.
- El usuario nunca ve la URL de YouTube directamente.
- Nivel de protección aceptado: el video está no listado, la URL podría encontrarse en el código del navegador por un usuario técnico, pero no es accesible públicamente.

### Gestión por el admin
Desde `/admin/clases` la admin puede:
- **Publicar** una clase nueva (pegar el YouTube Video ID, agregar título, descripción, instructor, categoría, tipo).
- **Ocultar** una clase (deja de aparecer para usuarios pero no se elimina).
- **Eliminar** permanentemente una clase.
- **Agregar contenido extra** (clases no en vivo, materiales adicionales).

### Almacenamiento
- Los videos no tienen costo de almacenamiento (YouTube gratuito).
- No se usa ningún servicio de video de pago.
- Al lanzamiento se esperan ~2-3 clases en catálogo.

---

## 10. Módulo: Perfil

Accesible en `/perfil` para cualquier usuario con sesión.

### Secciones del perfil

| Sección | Descripción |
|---|---|
| Mis datos | Nombre, ubicación, género, edad. Editable. |
| Mi formulario de preferencias | Ver y editar respuestas al formulario `[TBD]` |
| Mis Puntos Kiori | Saldo actual. Historial de movimientos (ganados/usados). |
| Mi suscripción | Estado, plan, fecha de próximo cobro, botón para cancelar. |
| Historial de pedidos | Lista de órdenes con status, productos, totales y opción de solicitar devolución. |
| Mis paquetes | Historial de cajas mensuales enviadas. |
| Mis devoluciones | Estado de solicitudes de devolución. |
| Mi código de referido | Código personal (KIORI-XXXXX) para compartir. |

---

## 11. Sistema de Referidos y Puntos Kiori

### Puntos Kiori (moneda virtual)
- Nombre: **Puntos Kiori**
- Equivalencia: 1 Punto Kiori = $1 MXN de descuento.
- Se muestran en el perfil del usuario como saldo disponible.
- Se aplican en el checkout como descuento parcial o total (el usuario elige cuántos usar).
- El admin puede **agregar o restar** Puntos Kiori a cualquier usuario desde `/admin/usuarios`.
- Usos: recompensas de referidos, resolución de devoluciones, promociones especiales.

### Sistema de referidos
- Cada usuario tiene un código único con formato `KIORI-XXXXX`.
- El código se comparte de forma directa (el usuario lo copia desde su perfil).
- Cuando alguien se registra, puede ingresar el código de quien lo refirió durante el registro.
- **Condición de recompensa:** el usuario referido debe realizar su **primera compra** o activar una **suscripción** para que la recompensa se otorgue.
- **Recompensa:** el referidor recibe **150 Puntos Kiori** (equivalente a $150 MXN de descuento).
- La recompensa se otorga **una sola vez por usuario referido**.
- El referidor recibe una **notificación por email** cuando se otorga la recompensa.

### Límites de referidos
- Máximo **2 referidos activos por mes** (que generen recompensa).
- El contador se resetea el **1 de cada mes**.
- Si el usuario ya alcanzó el límite del mes, el referido puede crear cuenta y comprar, pero el referidor no recibe recompensa hasta el siguiente mes. `[Decisión de negocio: confirmar si se otorga en el siguiente mes o se pierde]`

---

## 12. Panel de Administración

### Acceso
- Una sola cuenta admin por ahora (rol `'admin'` en el modelo User).
- El middleware de Next.js bloquea todas las rutas `/admin/*` para usuarios sin rol admin.
- Todo el panel está en **español**.

### Sección: Pedidos (`/admin/pedidos`)
- Lista de todos los pedidos de tienda con filtros por status.
- Ver detalle de cada pedido (usuario, productos, total, dirección).
- Actualizar status del pedido.
- Ver número de rastreo de Envía.com.

### Sección: Paquetes (`/admin/paquetes`)
- Lista de cajas mensuales por mes y usuario.
- Ver el contenido recomendado por el sistema basado en las preferencias del usuario.
- Confirmar contenido final y marcar como "empacando" → "enviado".
- Registrar número de rastreo.

### Sección: Usuarios (`/admin/usuarios`)
- Lista de todos los usuarios.
- Ver detalle: datos personales, suscripción, historial de pedidos.
- **Agregar o restar Puntos Kiori** al saldo de cualquier usuario con justificación en nota interna.
- Ver el código de referido de cada usuario.

### Sección: Productos (`/admin/productos`)
- Crear nuevo producto: nombre, descripción, precio, categorías (múltiple), cantidad, imagen (upload a Cloudinary).
- Editar producto existente.
- Actualizar stock (restockear).
- Activar/desactivar visibilidad en tienda.
- Eliminar producto.

### Sección: Clases (`/admin/clases`)
- Agregar nueva clase: título, descripción, YouTube Video ID, tipo (en vivo / grabada), instructor, categoría, duración.
- Publicar / ocultar clase.
- Eliminar clase.

### Sección: Devoluciones (`/admin/devoluciones`)
- Lista de solicitudes con status (pendiente / aprobada / rechazada).
- Ver detalle: pedido original, motivo del usuario.
- Aprobar con resolución elegida: **reenvío del artículo** o **abono en Puntos Kiori**.
- Rechazar con nota.
- El usuario recibe email automático con la resolución.

---

## 13. Landing Page y Animaciones

### Tecnología de animaciones
- **GSAP + ScrollTrigger** (gratuito para uso no comercial, licencia estándar).
- Las animaciones son **scroll-driven**: el progreso de la animación es proporcional al scroll. Si el usuario deja el scroll a la mitad de una transición, la animación se queda en ese estado.
- En **móvil**: animaciones simplificadas a fade-in al entrar en el viewport (sin animaciones direccionales).

### Estructura de la landing page

La landing tiene 4 secciones que fluyen en scroll continuo (no hay separación abrupta entre ellas).

---

#### Sección 1 — Hero

**Contenido:**
- Logo de Kiori (esquina superior izquierda del navbar)
- Navbar con links de navegación `[TBD: confirmar ítems del navbar además del logo]`
- Video de fondo a pantalla completa `[PENDIENTE: recibir archivo de video; usar placeholder hasta entonces]`
- Encabezado: **"ENERGÍA QUE"** (Futura Std Bold) + **"INSPIRA"** (Futura Std Heavy, en cursiva con color rosa palo)
- Subtexto: "Meditación y wellness en un solo sitio" (o similar) `[TBD: texto exacto]`
- Botón CTA: **"ÚNETE A LA COMUNIDAD KIORI"** — redirige a `/registrarse`

**Transición a sección 2 (scroll-driven):**
1. El video hace fade out (opacidad de 1 a 0).
2. El color de fondo blanco rosado (`#EDE6E9`) emerge.
3. El texto del hero sube y desaparece.
4. El nuevo texto entra suavemente desde la izquierda.
5. Las imágenes de la sección 2 entran desde la derecha.

---

#### Sección 2 — "Kiori es un espacio de bienestar"

**Contenido:**
- Fondo: blanco rosado (`#EDE6E9`)
- Columna izquierda: 
  - Encabezado: **"KIORI es un espacio de"** (Futura Std Bold)
  - Subtítulo: *"bienestar, energía y rituales conscientes."* (estilo cursivo/itálico, color verde salvia o nude arena)
  - Párrafo descriptivo `[TBD: texto exacto a proveer por el cliente]`
  - Botón: **"TU PLAN PERFECTO"** — redirige a `/suscripcion`
- Columna derecha: dos o tres imágenes apiladas `[PENDIENTE: recibir imágenes; usar placeholders]`

**Transición a sección 3 (scroll-driven):**
1. Las imágenes de la sección 2 hacen fade out.
2. Una imagen grande de fondo hace fade in.
3. La caja de misión/visión (color rosa palo, bordes redondeados) emerge desde la parte inferior.
4. El texto dentro de la caja hace fade in línea por línea, de arriba hacia abajo.

---

#### Sección 3 — "Nuestra misión y visión"

**Contenido:**
- Fondo: imagen fotográfica grande `[PENDIENTE: recibir imagen]`
- Caja izquierda (rosa palo, semitransparente):
  - Texto en cursiva: *"Nuestra misión y visión en KIORI es inspirar y acompañar a las personas a través de experiencias, productos y herramientas de energía consciente, creando una comunidad cercana que transforme el wellness en un estilo de vida auténtico, inspirador y en constante evolución."* `[TBD: confirmar texto exacto]`
- Lado derecho: imagen o espacio visual complementario `[PENDIENTE]`

**Transición a sección 4 (scroll-driven):**
1. El fondo de imagen hace fade out, el color de fondo `#EDE6E9` toma protagonismo.
2. Las tres tarjetas de servicios entran:
   - Tarjeta izquierda: entra desde la izquierda.
   - Tarjeta central: entra desde abajo.
   - Tarjeta derecha: entra desde la derecha.
3. Las tarjetas comienzan como cajas vacías (sin imagen).
4. Conforme se acercan a su posición final, las imágenes hacen fade in dentro de las tarjetas.

---

#### Sección 4 — Servicios

**Contenido:**
- Fondo: blanco rosado (`#EDE6E9`)
- Encabezado: **"SERVICIOS"** (Futura Std Bold, centrado)
- Subtítulo: "Opciones creadas para acompañarte en tu camino de bienestar"
- Tres tarjetas de servicio con imagen, nombre y subtítulo:
  - Tarjeta 1: Suscripción (caja mensual) → redirige a `/suscripcion`
  - Tarjeta 2: Tienda individual → redirige a `/tienda`
  - Tarjeta 3: Clases en línea → redirige a `/clases`
  - `[TBD: nombres y subtítulos exactos de cada tarjeta, e imágenes]`

---

### Resto de la landing page
El diseño SVG incluye más secciones debajo de las 4 animadas. Estas secciones serán especificadas en una segunda iteración cuando el cliente provea el texto y las imágenes correspondientes. `[PENDIENTE]`

---

## 14. Navegación

### Navbar (en todas las páginas)
- Logo Kiori (izquierda) → link a `/`
- Links principales: **Tienda**, **Clases**, **Suscripción**
- Si no hay sesión: botones **Iniciar sesión** / **Registrarse**
- Si hay sesión: link a **Mi perfil** + botón de **Cerrar sesión**
- Si hay sesión admin: link adicional a **Administrador**
- En móvil: menú hamburguesa

### Footer
- Logo Kiori
- Links de navegación principales
- Información de contacto `[TBD]`
- Aviso de privacidad / Términos y condiciones `[TBD]`
- Redes sociales `[TBD]`

---

## 15. Integraciones Externas

### Stripe
- **Uso:** Pagos de tienda (pago único) y suscripciones (cobro recurrente).
- **Implementación:** Stripe Subscriptions para suscripciones. Payment Intents para compras individuales.
- **Webhooks:** El endpoint `/api/webhooks/stripe` actualiza estados en MongoDB.
- **Credenciales:** `[PENDIENTE: recibir de cliente]`

### Envía.com
- **Uso:** Cálculo de costo de envío y generación de guías.
- **Implementación:** API call desde server-side en el checkout para mostrar costo antes de pagar.
- **Credenciales:** `[PENDIENTE: recibir de cliente]`
- **Pendiente:** Confirmar si la API de Envía.com permite cálculo en tiempo real por dirección o solo por zonas predefinidas.

### Cloudinary
- **Uso:** Almacenamiento de imágenes de productos, subidas desde el panel admin.
- **Implementación:** El admin sube la imagen desde la UI → el servidor la envía a Cloudinary → se guarda la URL en MongoDB.
- **Plan:** Gratuito (suficiente para < 100 productos).
- **Credenciales:** `[PENDIENTE: recibir de cliente]`

### NextAuth.js (Auth.js)
- **Uso:** Gestión de sesiones, login con email/contraseña y Google OAuth.
- **Implementación:** JWT strategy, con callback personalizado para incluir el rol del usuario en el token.
- **Credenciales de Google:** Client ID y Client Secret desde Google Cloud Console. `[PENDIENTE]`

### YouTube
- **Uso:** Embed de clases en vivo y grabadas.
- **Implementación:** Solo se almacena el Video ID. El embed se construye con `youtube-nocookie.com` en el servidor.
- **Costo:** Gratuito.

---

## 16. Seguridad

- Toda la lógica de negocio en API Routes de Next.js (nunca en el cliente).
- Variables de entorno en Vercel para todas las claves (nunca en el código).
- Middleware de Next.js para proteger rutas privadas y de admin.
- Contraseñas hasheadas con bcrypt.
- Videos de YouTube con modo privacy-enhanced y no listados.
- Stripe: validación de webhooks con signing secret.
- CORS y rate limiting en endpoints sensibles (pagos, auth).
- Input validation con Zod en todos los API routes.

---

## 17. Notificaciones por Email

| Evento | Destinatario | Contenido |
|---|---|---|
| Referido activa recompensa | Referidor | "Tu referido [nombre] hizo su primera compra. Recibiste 150 Puntos Kiori." |
| Devolución resuelta | Usuario | Resultado de la devolución (aprobada con reenvío / aprobada con puntos / rechazada) |
| Confirmación de pedido | Usuario | Resumen del pedido y número de rastreo cuando esté disponible |
| Confirmación de suscripción | Usuario | Bienvenida y detalles del plan |
| Cancelación de suscripción | Usuario | Confirmación y fecha de fin de acceso |

- Proveedor de email: `[TBD: Resend o SendGrid, ambos con plan gratuito generoso]`

---

## 18. Pendientes (TBD)

Los siguientes elementos deben ser provistos o definidos antes de comenzar la implementación correspondiente:

| # | Ítem | Responsable |
|---|---|---|
| 1 | Precios de planes de suscripción (mensual, trimestral, anual) | Cliente |
| 2 | Preguntas y opciones del formulario de preferencias | Cliente |
| 3 | Lógica de recomendación: mapeo preferencias → productos de la caja | Cliente |
| 4 | Texto exacto para secciones 2, 3 y 4 de la landing page | Cliente |
| 5 | Imágenes para secciones 2, 3 y 4 de la landing page | Cliente |
| 6 | Video para el hero de la landing page | Cliente |
| 7 | Logo en SVG/PNG con fondo transparente | Cliente |
| 8 | Archivos de fuente Futura Std Bold y Heavy (.woff2) | Cliente |
| 9 | Paleta de colores completa y guía de marca (ya parcialmente recibida) | Cliente |
| 10 | Credenciales de Stripe | Cliente |
| 11 | Credenciales de Cloudinary | Cliente |
| 12 | Credenciales de Envía.com + confirmar tipo de integración (tiempo real o zona) | Cliente |
| 13 | Credenciales de Google OAuth | Cliente |
| 14 | Nombres definitivos de las 6 categorías de productos | Cliente |
| 15 | Ítems del navbar (más allá del logo) | Cliente |
| 16 | Texto e imágenes del footer | Cliente |
| 17 | Secciones 5-10 del SVG de diseño (resto de la landing y otras páginas) | Cliente |
| 18 | Proveedor de email para notificaciones (Resend o SendGrid) | Decisión conjunta |
| 19 | Política cuando referral llega al límite mensual: ¿se otorga el siguiente mes o se pierde? | Cliente |
| 20 | Texto exacto de tarjetas de servicio en sección 4 de la landing | Cliente |
| 21 | Aviso de privacidad y términos y condiciones | Cliente |

---

## 19. Convenciones de Código

- **Comentarios:** En español.
- **Nombres de variables, funciones, componentes, archivos:** En inglés.
- **Componentes React:** PascalCase (`ProductCard`, `CheckoutModal`).
- **Variables y funciones:** camelCase (`fetchProducts`, `userPuntosBalance`).
- **Constantes globales:** UPPER_SNAKE_CASE (`MAX_REFERRALS_PER_MONTH`).
- **Archivos de página:** según convención de Next.js App Router (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **API Routes:** `/app/api/[recurso]/route.ts`.
- **Modelos Mongoose:** en `/lib/models/` con nombre en PascalCase singular (`User.ts`, `Product.ts`).
- **Un solo archivo de estilos globales:** `/app/globals.css` con variables CSS en `:root`.

---

*Fin del documento de especificación — Kiori v1.0*
