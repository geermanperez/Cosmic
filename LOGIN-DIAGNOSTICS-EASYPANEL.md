# Diagnostico temporal de login Yuna en EasyPanel

Base: geermanperez/Cosmic, rama easypanel.
Commit revisado: f8cad5b3f271a38f2dc546bb62acb2cc4e0ebd0e.

El cambio agrega instrumentacion opcional al servidor de login. No modifica
autenticacion, cifrado, base de datos ni archivos WZ. No es todavia una
correccion de compatibilidad del cliente Yuna.

## Incorporacion

Aplicar cosmic-easypanel-login-diagnostics.patch a un checkout de easypanel:

```sh
git apply --check cosmic-easypanel-login-diagnostics.patch
git apply cosmic-easypanel-login-diagnostics.patch
```

Revisar y compilar antes de publicar. El parche fue comprobado contra el
commit indicado y con git diff --check; no fue compilado localmente porque
este equipo no dispone de Java/Maven/Docker.

Publicar los cambios requiere actualizar el repositorio que EasyPanel usa
para construir el servicio. Esto puede activar un despliegue automatico.
La activacion requiere que EasyPanel despliegue el commit con este cambio.

## Activacion en EasyPanel

En el servicio del juego que construye el Dockerfile de la raiz de Cosmic,
agregar esta variable de entorno, conservando las demas:

```text
LATINMS_LOGIN_DIAGNOSTICS=true
```

Desplegar ese servicio con el codigo del parche incorporado. El Dockerfile
compila el servidor con Java 21. El proceso Java hereda la variable desde
everlaf-start.sh; no requiere cambiar el comando de arranque.
Agregar solo la variable a la imagen anterior NO agrega el diagnostico.

Hacer un intento manual de ingreso con Yuna. En los registros buscar
LoginDiag y conservar las lineas de la misma session. Si es necesario,
comparar con un intento del cliente original Latin MS.

- stage=wire direction=receive: llegaron bytes, no necesariamente un paquete completo.
- stage=decoded direction=receive: se decodifico un mensaje; opcode identifica su tipo.
- stage=decoded direction=send: el servidor genero una respuesta.
- exception/root: tipo de excepcion, sin mensaje ni contenido de paquetes.
- closed received=0: no hubo mensajes en esa etapa; puede ser el medidor de latencia.

Como maximo se registran 32 eventos por direccion y etapa en cada conexion,
ademas de excepciones y cierre. El parche no registra usuarios, contrasenas,
contenido de paquetes ni direcciones IP. Los otros registros del servidor
siguen funcionando como antes; mantener USE_DEBUG_SHOW_PACKET=false.

Para desactivar, cambiar LATINMS_LOGIN_DIAGNOSTICS a false y redesplegar
solo el servicio del juego. No es necesario cambiar la base de datos.
