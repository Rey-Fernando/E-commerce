# E-commerce Full Stack

Aplicaci�n de cat�logo con carrito, checkout y pasarela de pagos basada en React, Node.js y MongoDB.

## Requisitos

- Node.js 18+
- MongoDB 6+
- Cuenta de Stripe (modo pruebas) para generar llaves `pk_test` y `sk_test`

## Instalaci�n

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
# actualiza MONGODB_URI, STRIPE_SECRET_KEY y dem�s variables
```

## Datos de ejemplo

```bash
cd server
npm run seed
```

## Ejecuci�n en desarrollo

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

- `client/`: Aplicaci�n React con Zustand para el carrito y Stripe Elements.
- `server/`: API Express con MongoDB y endpoints para productos, pagos y �rdenes.
- `server/src/scripts/seed.js`: script para poblar productos demo.

## Variables de entorno clave

Servidor (`server/.env`):
- `PORT`: puerto de Express.
- `MONGODB_URI`: conexi�n a MongoDB.
- `STRIPE_SECRET_KEY`: clave secreta Stripe.
- `CLIENT_URL`: origen permitido para CORS.

Cliente (`client/.env`):
- `VITE_STRIPE_PUBLISHABLE_KEY`: clave p�blica Stripe.

## Pr�ximos pasos sugeridos

- Implementar autenticaci�n y panel de administraci�n.
- Manejar webhooks de Stripe para confirmar pagos as�ncronos.
- A�adir pruebas unitarias y de integraci�n.
- Desplegar en plataformas como Vercel (frontend) y Render/Fly.io (backend).
