/**
 Happy - Happy ville
 @author Ronan
 **/
var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            cm.sendOk("Hablame de nuevo cuando quieras.");
            cm.dispose();
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("#b<Misión de incursión: Happyville>#k\r\nUna incursión no es más que mucha gente uniéndose en un intento de derrotar a criaturas extremadamente poderosas. Aquí no es diferente. Todos pueden participar en la derrota de la criatura engendrada. ¿Qué vas a hacer?\r\n#b\r\n#L0#Engendra al niño muñeco de nieve.\r\n#L1#Genera a Rudolph perdido.\r\n#L2#Nada, sólo escalofriante.#k");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getMap().getMonsters().size() > 1) {  //reactor as a monster? wtf
                    cm.sendOk("Elimina a todos los mobs de la zona para llamar a Kid Snowman.");
                    cm.dispose();
                    return;
                }

                cm.getMap().spawnMonsterOnGroundBelow(9500317, 1700, 80);
            } else if (selection == 1) {
                if (cm.getMap().getMonsters().size() > 6) {  //reactor as a monster? wtf
                    cm.sendOk("El lugar está demasiado lleno ahora mismo. Elimina algunos mobs antes de volver a intentarlo.");
                    cm.dispose();
                    return;
                }

                cm.getMap().spawnMonsterOnGroundBelow(9500320, 1700, 80);
            } else {
                cm.sendOk("Bien entonces.");
            }

            cm.dispose();
        }
    }
} 