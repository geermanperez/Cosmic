# Investigación de Jarvis — 2026-09-25

Alcance: revisión estática del servidor, índice binario de EverleafMs/Character.wz, simulación del script en Node y lectura de registros históricos. No se ejecutó el juego ni se modificaron scripts, WZ o binarios.

## Recorrido

`JarvisCommand` abre NPC 9999802; su opción de belleza abre `scripts/npc/9900000.js`. Este script construye listas y llama a `NPCConversationManager.sendStyle`, que envía `PacketCreator.getNPCTalkStyle` (tipo 7). Los setters actualizan estadísticas y apariencia.

## Hallazgos confirmados

- Los índices de Hair coinciden: 12.514 archivos en cliente y servidor; Face: 7.259 en ambos. No hay diferencias de nombres en esas carpetas. Esto NO verifica igualdad del contenido, enlaces internos ni renderizado.
- Los 80 pelos masculinos, 80 femeninos, 40 caras masculinas y 40 femeninas base del salón existen en ambos.
- Faltan en el cliente 28 variantes que el script genera: 30011–30017, 30071–30077, 30081–30087 y 30091–30097. Los cuatro estilos base existen, pero sus colores 1–7 no.
- Simulación reproducible: con pelo 30010, elegir color produce [30010,30011,30012,30013,30014,30015,30016,30017]. Con pelo 30001, abrir la primera página masculina produce [30001,30011,30021,30031,30041,30051,30061,30071]. Contienen recursos inexistentes antes de aplicar ningún cambio.
- `buildStyleList` solo copia; no consulta `getCosmeticItem`, que ya existe en NPCConversationManager y permite detectar recursos faltantes o resolver al estilo base. Tampoco elimina duplicados ni la apariencia actual.
- Todos los colores 0–6 de las caras base del catálogo existen; todos los colores 0–7 de los pelos femeninos base existen. No se validaron aquí las variantes de cualquier estilo personalizado que un jugador pueda tener equipado.
- Existen cuerpo y cabeza para pieles 0–17 en el índice del cliente; el enum del servidor admite 0–17, pero el menú solo ofrece 0–3. Es una limitación del script, no evidencia de ausencia de esos archivos.
- Los comentarios que excluyen rangos completos por supuesta incompatibilidad con v83 no son una validación del cliente Yuna personalizado.

## Pruebas y límites

`node --test tools/tests/cosmetic-preview.test.cjs`: 5 pasan (NPC 9900001), 5 fallan (9900000). Los fallos inmediatos son por mock sin getNX; las categorías esperadas también corresponden a otro diseño del menú. No prueban un fallo real de getNX en Java ni reproducen el crash del cliente.

Los ZIP de crash del 03/09 a las 20:01 y 20:05 fueron leídos. El de 20:01 muestra ACCESS_VIOLATION en EverleafMS.exe, dirección 0x4031FE, personaje desconocido y cero paquetes registrados. No permite atribuir el cierre a Jarvis. Hay un dump posterior del 04/09 con TXT vacío; no se analizó su pila binaria.

Enviar IDs inexistentes es un defecto confirmado y un candidato fuerte para cierres durante la previsualización. No se confirmó que explique todos los fallos de piel, ojos o aplicación: falta reproducirlos en el juego y correlacionarlos con paquetes y un dump de esa sesión.

## Foro Yuna

https://yuna.ms/forum/index.php?threads/is-there-any-hair-guide-for-the-server.290/

El hilo describe estilos adicionales mediante la sección Donator de Jarvis y Super Style Coupon. Sirve como referencia funcional; no demuestra que los scripts locales ni el protocolo de su cliente sean idénticos. No se encontró en la búsqueda realizada una solución pública específica para este crash.

## Corrección recomendada

1. Validar cada ID final (después de sumar el color) antes de enviar la previsualización; usar el catálogo verificado, eliminar duplicados y manejar listas vacías. Mantener la misma lista para resolver la selección y aplicar.
2. Construir el catálogo desde datos comprobados, en lugar de asumir seguridad por rango numérico. Para piel, verificar cuerpo y cabeza además del enum.
3. Actualizar las pruebas al flujo actual y cubrir los cuatro pelos sin colores, ambos géneros, piel, ojos, cancelación y cobro.
4. Reproducir con el cliente real usando LATINMS_LOGIN_DIAGNOSTICS=true para registrar los IDs enviados. Si piel/ojos siguen cerrando, capturar el crash de esa sesión y revisar el decodificador de diálogo y actualización de apariencia.


## Corrección aplicada

Se actualizó 9900000.js para verificar el archivo gráfico final bajo WZFiles.CHARACTER (respeta wz-path) mediante Java.type y Files.isRegularFile, mecanismos permitidos por AbstractScriptManager. No depende de nombres de String.wz ni requiere recompilar Java. Piel verifica cuerpo, cabeza y enum. El catálogo ofrece los tonos 0–17 disponibles. Los colores sin recurso se omiten sin sustituir el estilo; se excluye la apariencia actual y se conservan los índices de selección.

Los mensajes de lista vacía y falta de NX terminan en un estado que solo permite cerrar. La selección se consume antes de aplicar/cobrar, y se vuelve a verificar disponibilidad antes de modificar el personaje.

Validación: node --test tools/tests/cosmetic-preview.test.cjs tools/tests/jarvis-salon.test.cjs — 10 pruebas pasan. Se recorren 230 combinaciones de página, género y color además de piel, tintes, cancelación, selección inválida, recursos ausentes, saldo insuficiente y GM. La suite usa Node con puente Java simulado y archivos XML reales; no sustituye una ejecución GraalJS ni la prueba gráfica del cliente.

Para activar: usar este script en la instancia de servidor que atiende al cliente y abrir una conversación nueva (reconectar si conserva un script cacheado). No se desplegó en ningún servidor remoto ni se ejecutó el juego. Verificar en cliente @jarvis → salón → piel/ojos/pelo. Si persiste un cierre, se necesita el registro generado en esa sesión para investigar el cliente y los paquetes.

## Nuevo registro: incompatibilidad binaria confirmada

El registro adjuntado posteriormente captura la sesión 7884: a las 18:02:39.799 se genera `preview=[0, 1, 2, 4, 5, 9, 10, 11]`; a las 18:02:39.800 se envía NPC_TALK (304), 85 bytes. A las 18:02:40.452 llega PARTY_SEARCH_UPDATE (223), y a las 18:02:40.453 se cierra la conexión. No hay NPC_TALK_MORE después del preview, ni selección ni cobro. PARTY_SEARCH_UPDATE solo desregistra la búsqueda de grupo; no es un reporte de error. El usuario confirma que el programa se cierra por completo.

Se desensamblaron, sin modificarlos, EverleafMS.exe y yunams.dll locales. El EXE original despacha el diálogo tipo 7 en 0x7466FE a 0x74713D. Lee el texto, un byte de cantidad (0x747172, Decode1 = 0x4065F3) y un entero por estilo (Decode4 = 0x406629).

Pero yunams.dll **cambia ese protocolo al ejecutarse**:

- RVA 0xE698: `push 0x406629; push 0x747172; call ...` reemplaza la llamada de lectura de cantidad por Decode4.
- RVA 0xE6A7: instala tres NOP en 0x747177, eliminando la reducción del resultado a un byte (`movzx eax, al`).
- También modifica el envío del índice elegido a un entero (hook 0x1000E560; Encode4 en 0x4065A6). NPCMoreTalkHandler ya admite selecciones de cuatro bytes.
- SHA-256 del DLL inspeccionado: `0c53370b19352fd710ca6fe56c5a2c442fde650322eaf7528feaba7c6f405063`.

El servidor conservaba `p.writeByte(count)`. Con los ocho tonos del registro, el cliente consume tres bytes del primer ID al leer la cantidad. La primera piel se convierte en 256 y quedan 29 bytes para leer ocho enteros (32 bytes). En pelo/cara también puede interpretar una cantidad enorme. Esto demuestra una incompatibilidad de protocolo que el filtrado de IDs y las pruebas de scripts anteriores no detectaban. No se atribuye una dirección de excepción concreta sin un dump nuevo.

Corrección: `PacketCreator.getNPCTalkStyle` escribe `p.writeInt(count)`. El paquete del registro pasa de 85 a 88 bytes, conservando texto e IDs. Es específico del cliente Yuna parcheado; el cliente v83 original espera un byte. Se conserva el límite de 120 opciones y no se modifican otros tipos de diálogo ni binarios del juego.

`NpcStyleEncodingTest` verifica el paquete real de piel, pelo, cara, una sola opción y el límite de 120. Incluye una reproducción del desplazamiento del formato anterior. Esta actualización Java requiere reconstruir la imagen/JAR del servidor y reiniciar la instancia desplegada. Actualizar solo scripts o reconectar no basta. La validación final en el juego sigue pendiente del despliegue.

Validación ejecutada con JDK 21: `mvnw.cmd -B -ntp -Dtest=NpcStyleEncodingTest test` finalizó con BUILD SUCCESS (3 pruebas, 0 fallos, 0 errores). `mvnw.cmd -B -ntp -DskipTests package` también finalizó con BUILD SUCCESS y generó `target/Cosmic.jar`. Las pruebas ya se habían ejecutado antes del empaquetado. No se realizó despliegue remoto. EverleafMs continúa excluido de Git.
