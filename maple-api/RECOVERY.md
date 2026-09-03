# Recuperar Maple API en el servidor Cosmic

El log del 03/09/2026 muestra conexiones exitosas, seguidas de
`ECONNREFUSED 172.19.0.2:3306`. MySQL dejó de aceptar conexiones en ese destino.
El log de la API no permite distinguir entre caída de MySQL, reinicio,
problema del volumen o cambio de red. El aviso de Admin HTTP es independiente:
la API ya usa una consulta de base de datos como alternativa para jugadores online.

Desde la carpeta Cosmic del servidor y con el mismo proyecto Compose de producción:

```sh
docker compose ps -a
docker compose logs --tail=200 db
docker compose logs --tail=100 maple-api
df -h
docker compose exec db mysql -h 127.0.0.1 -uroot cosmic -e "SELECT 1; SELECT COUNT(*) AS accounts FROM accounts; SELECT COUNT(*) AS characters FROM characters;"
```

Si `db` está detenido, iniciarlo con `docker compose start db` y revisar de nuevo
sus logs. Si aparece ejecutándose pero rechaza conexiones, revisar esos logs antes
de decidir reiniciarlo: `docker compose restart db` interrumpe también la conexión
del juego. Si faltan tablas o cuentas, verificar el volumen y el nombre del proyecto
Compose original; no inicializar una base nueva como sustituto.

No ejecutar `docker compose down -v` ni eliminar/cambiar el volumen
`cosmic-db-data`. Este Compose incluye `everlaf-reset`, un borrado de jugadores;
no levantar todo el stack para recuperar la API.

Una vez recuperado MySQL, subir los cambios de `maple-api` y `docker-compose.yml`
a la carpeta Cosmic utilizada por el despliegue. Reconstruir únicamente la API:

```sh
docker compose up -d --build --no-deps maple-api
docker compose logs --tail=100 maple-api
docker compose exec maple-api node -e "fetch('http://127.0.0.1:3001/health').then(async r=>{console.log(r.status,await r.text());process.exit(r.ok?0:1)}).catch(e=>{console.error(e.message);process.exit(1)})"
docker compose restart maple-web
```

Si la API responde 200 dentro del contenedor pero la web devuelve 502, comparar
desde maple-web `wget -S -O - http://maple-api:3001/health` con
`wget -S -O - http://127.0.0.1/api/health`. Si solo falla el segundo, ejecutar
`nginx -t && nginx -s reload` en maple-web para actualizar el upstream sin
reiniciar el juego. Esto recuperó el acceso público el 03/09/2026.

La configuración actual de maple-web usa el DNS de Docker (`127.0.0.11`) y
un upstream con `resolve`, para actualizar la IP de maple-api cada 10 segundos.
Requiere Nginx 1.27.3 o posterior; fue validada en el contenedor de producción.
Reconstruir maple-web en el próximo despliegue para conservar esta configuración.

El reinicio de maple-web también permite que Nginx resuelva la IP actual de maple-api.
`--no-deps` evita ejecutar servicios adicionales; la API espera internamente a
MySQL y al esquema del juego. Los nuevos healthchecks del Compose se aplican
cuando se recrea cada contenedor; no hace falta recrear db para recuperar la API.

Verificar desde la web el ranking de personajes, guilds, resets y bosses, y crear
una cuenta de prueba confirmando luego su login. `/api/health` debe devolver 200
y `database: ready`; ante una caída posterior de MySQL devuelve 503. El pool
puede establecer nuevas conexiones cuando MySQL vuelve; no se reintentan
automáticamente escrituras de cuentas o recompensas.

Pruebas locales: `cd maple-api && npm test`.
