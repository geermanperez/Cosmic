var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0) {
            cm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        var eim = cm.getEventInstance();
        if (eim == null) {
            cm.sendNext("El evento no ha comenzado...");
            cm.dispose();
            return;
        }
        switch (cm.getPlayer().getMapId()) {
            case 610030100:
                if (status == 0) {
                    cm.sendNext("Ah, has logrado entrar. Déjame decirte muy rápido: ya nos atraparon. Los Maestros Guardianes están a punto de llegar aquí en aproximadamente un minuto. Será mejor que nos demos prisa.");
                } else if (status == 1) {
                    cm.sendNext("El portal a los Twisted Masters está roto. Tenemos que encontrar un camino alternativo, uno que nos lleve a través de muchas trampas mortales.");
                } else if (status == 2) {
                    cm.sendNext("Puedes encontrar el portal en algún lugar por aquí... será mejor que lo encuentres rápido. Me pondré al día.");
                    cm.dispose();
                }
                break;
            case 610030200:
                if (status == 0) {
                    cm.sendNext("¡Eso fue un éxito! Ahora, para este camino, creo que necesitamos que uno de cada clase de Aventureros lo pase.");
                } else if (status == 1) {
                    cm.sendNext("Necesitan usar sus habilidades en cada una de estas cosas llamadas Sigilos. Una vez que hayamos terminado los cinco, podremos pasar.");
                    cm.dispose();
                }
                break;
            case 610030300:
                if (status == 0) {
                    cm.sendNext("Ahora lo que tenemos aquí son más Sigilos. Al menos cinco aventureros deben subir a la cima y atravesar el portal. Sin embargo, ten en cuenta que no todos los muros o terrenos de este mapa son lo que parecen, ¡así que anda con cuidado!");
                } else if (status == 1) {
                    cm.sendNext("Ah, y cuidado con estas trampas mortales: los menhires. Realmente tienen un gran impacto. Buena suerte.");
                    cm.dispose();
                }
                break;
            case 610030400:
                if (status == 0) {
                    cm.sendNext("Ahora lo que tenemos aquí son más Sigilos. Sin embargo, algunos de ellos no funcionan. Aquí todos los trabajos deben cumplir sus funciones, ya que al menos uno de estos Sigilos se activa según sus habilidades laborales; sin embargo, puede haber más de uno por trabajo, así que asegúrese de probarlos todos.");
                } else if (status == 1) {
                    cm.sendNext("Estos Stirges se interpondrán en tu camino, pero no son más que una distracción. Para deshacerte de ellos, haz que cinco aventureros se paren simultáneamente en la plataforma del medio izquierdo. Para aprobar, prueba cada uno de estos Sigilos hasta que funcionen.");
                    cm.dispose();
                }
                break;
            case 610030500:
                if (status == 0) {
                    cm.sendNext("¡Me sorprende que hayas llegado tan lejos! Lo que ves aquí es la estatua de Crimsonwood Keep, pero sin ninguna de sus armas.");
                } else if (status == 1) {
                    cm.sendNext("Hay cinco habitaciones, marcadas por una estatua cerca de cada una de ellas, alrededor de la estatua.");
                } else if (status == 2) {
                    cm.sendNext("Sospecho que cada una de estas habitaciones tiene una de las cinco armas de la estatua.");
                } else if (status == 3) {
                    cm.sendNext("¡Recupera las armas y devuélvelas a la Reliquia de la Maestría!");
                    cm.dispose();
                }
                break;
            case 610030700:
                cm.sendNext("¡Fue un buen trabajo! Esto conduce al camino a la Armería de los Maestros Retorcidos.");
                cm.dispose();
                break;
        }
    }
}