# E-commerce Full Stack

Aplicación de catálogo con carrito, checkout y pasarela de pagos basada en React, Node.js y MongoDB.

## Requisitos

- Node.js 18+
- MongoDB 6+
- Cuenta de Stripe (modo pruebas) para generar llaves `pk_test` y `sk_test`

## Instalación

```bash
# Cliente
cd client
npm install
cp .env.example .env
# agrega tu VITE_STRIPE_PUBLISHABLE_KEY

# Servidor
cd ../server
npm install
cp .env.example .env
# actualiza MONGODB_URI, STRIPE_SECRET_KEY y demás variables
```

## Datos de ejemplo

```bash
cd server
npm run seed
```

## Ejecución en desarrollo

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

- API disponible en `http://localhost:4000/api`
- Frontend en `http://localhost:5173`

## Flujo de pago

1. El cliente crea un Payment Intent en `/api/payments/create-intent`.
2. Stripe devuelve `clientSecret`, utilizado desde el frontend con `CardElement`.
3. Al confirmarse el pago se crea la orden en `/api/orders` con el `paymentIntentId`.

## Estructura principal

- `client/`: Aplicación React con Zustand para el carrito y Stripe Elements.
- `server/`: API Express con MongoDB y endpoints para productos, pagos y órdenes.
- `server/src/scripts/seed.js`: script para poblar productos demo.

## Variables de entorno clave

Servidor (`server/.env`):
- `PORT`: puerto de Express.
- `MONGODB_URI`: conexión a MongoDB.
- `STRIPE_SECRET_KEY`: clave secreta Stripe.
- `CLIENT_URL`: origen permitido para CORS.

Cliente (`client/.env`):
- `VITE_STRIPE_PUBLISHABLE_KEY`: clave pública Stripe.

## Próximos pasos sugeridos

- Implementar autenticación y panel de administración.
- Manejar webhooks de Stripe para confirmar pagos asíncronos.
- Añadir pruebas unitarias y de integración.
- Desplegar en plataformas como Vercel (frontend) y Render/Fly.io (backend).
