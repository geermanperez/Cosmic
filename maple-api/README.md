Maple API (minimal web account endpoints)

Instalación

1. Copiar variables: `cp .env.example .env` y ajustar valores.
2. Instalar dependencias:

```bash
npm install
```

Inicio

```bash
npm start
```

Endpoints principales

- `GET /status` — estado general.
- `POST /register` — crear cuenta (compatible con servidor Cosmic).
- `POST /login` — recibe `{ "username", "password" }`, devuelve `token`.
- `GET /account/me` — datos de cuenta y perfil (requiere `Authorization: Bearer TOKEN`).
- `GET /account/me/characters` — personajes del account (requiere token).
- `PUT /account/me/profile` — actualizar `display_name`, `avatar_url`, `bio` (requiere token).
- `POST /account/me/change-password` — cambiar contraseña (requiere token).
- `GET /account/check` — health autenticada (requiere token).

Uso de token

Enviar header:

```
Authorization: Bearer <TOKEN>
```

Advertencias

- Nunca conecte el frontend directamente a la base de datos. Siempre usar esta API.
- No exponer `JWT_SECRET` en repositorios públicos.
- Los endpoints mantienen compatibilidad con el formato de `password` actual usado por `/register`.
