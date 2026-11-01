var arena;
var status = 0;

function start() {
    arena = cm.getPlayer().getAriantColiseum();
    if (arena == null) {
        cm.sendOk("¡Oye, no te vi en el campo durante la batalla en la arena! ¿Qué estás haciendo aquí?");
        cm.dispose();
        return;
    }

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            menuStr = generateSelectionMenu(["I would like to check my battle points! / I would like to exchange (1) Palm Tree Beach Chair", "I would like to know more about the points of the Battle Arena."]);
            cm.sendSimple("Hola, ¿qué puedo hacer por ti?\r\n\r\n" + menuStr);
        } else if (status == 1) {
            if (selection == 0) {
                apqpoints = cm.getPlayer().getAriantPoints();
                if (apqpoints >= 100) {
                    cm.sendNext("Vaya, parece que tienes los puntos #b100#k listos para intercambiar, ¡¿vamos a intercambiar?!");
                } else if (apqpoints + arena.getAriantRewardTier(cm.getPlayer()) >= 100) {
                    cm.sendOk("Tu puntuación en Battle Arena: #b" + apqpoints + "#kpuntos y prácticamente ya tienes ese puntaje! hablar con mi esposa,#p2101016#para conseguirlos y luego volver a chatear conmigo!");
                    cm.dispose();
                } else {
                    cm.sendOk("Tu puntuación en Battle Arena: #b" + apqpoints + "#kagujas. necesitas superar#b100 puntos#kpara que pueda darte el#bSilla de playa de palmera#k. Hablame de nuevo cuando tengas suficientes puntos.");
                    cm.dispose();
                }
            } else if (selection == 1) {
                cm.sendOk("El objetivo principal de Battle Arena es permitir al jugador acumular puntos para que puedan canjearse honorablemente por el premio más alto: el#bSilla de playa de palmera#k. Suma puntos durante las batallas y habla conmigo cuando llegue el momento de conseguir el premio. En cada batalla, el jugador tiene la oportunidad de ganar puntos según la cantidad de joyas que tenga al final. ¡Pero ten cuidado! Si tus puntos se alejan de otros jugadores#res demasiado alto#k, todo esto habrá sido en vano y ganarás mera#r1 punto#ksolo.");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.getPlayer().gainAriantPoints(-100);
            cm.gainItem(3010018, 1);
            cm.dispose();
        }
    }
}

function generateSelectionMenu(array) {     // nice tool for generating a string for the sendSimple functionality
    var menu = "";
    for (var i = 0; i < array.length; i++) {
        menu += "#L" + i + "##b" + array[i] + "#l#k\r\n";
    }
    return menu;
}