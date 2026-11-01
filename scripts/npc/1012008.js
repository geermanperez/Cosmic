/*
 * @Author - Sparrow
 * @NPC - 1012008 - Casey the Game Master
 * @Map - 100000203 - Henesys Game Park
 */

var status;
var current;
var omok = [4080000, 4080001, 4080002, 4080003, 4080004, 4080005];
var omok1piece = [4030000, 4030000, 4030000, 4030010, 4030011, 4030011];
var omok2piece = [4030001, 4030010, 4030011, 4030001, 4030010, 4030001];
var omokamount = 99;
var text = "The set also differs based on what kind of pieces you want to use for the game. Which set would you like to make?"

function start() {
    current = 0;
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 && current > 0) {
        cm.dispose();
        return;
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
    }

    if (status == 0) {
        cm.sendSimple("Oye, parece que necesitas un respiro de toda esa caza. Deberías disfrutar de la vida, tal como lo hago yo. Bueno, si tienes un par de artículos, puedo cambiarlos por un artículo con el que puedas jugar minijuegos. Ahora... ¿qué puedo hacer por ti?#b\r\n#L0#Crea un elemento de minijuego#l\r\n#L1#Explícame de qué se tratan los minijuegos.#l#k");

    } else if (status == 1) {
        if (selection == 0) {
            cm.sendSimple("¿Quieres crear el elemento del minijuego? Los minijuegos no son algo que puedas simplemente jugar desde el principio. Para cada minijuego, necesitarás un conjunto específico de elementos. ¿Qué minijuego quieres hacer?#b\r\n#L4#Conjunto Omok#l\r\n#L5#Un juego de cartas de partido#l#k");
        } else if (selection == 1) {
            cm.sendSimple("¿Quieres saber más sobre los minijuegos? ¡Impresionante! Pregúntame cualquier cosa. ¿Sobre qué minijuego quieres saber más?#b\r\n#L2#Hijo#l\r\n#L3#Tarjetas de partido#l#k");
        }

    } else if (status == 2) {
        if (selection == 2) {
            current = 1;
            cm.sendNext("Estas son las reglas de Omok, así que escuche con atención. Omok es un juego en el que tú y tu oponente os turnáis para colocar una pieza sobre la mesa hasta que alguien encuentra la manera de colocar 5 piezas consecutivas en una línea, ya sea horizontal, diagonal o vertical. Para empezar, sólo los que tienen un#bConjunto Omok#kSe puede abrir una sala de juegos.");
        } else if (selection == 3) {
            current = 2;
            cm.sendNext("Estas son las reglas para Match Cards, así que escuche atentamente. Como sugiere el nombre, Match Cards consiste simplemente en encontrar un par coincidente entre la cantidad de cartas colocadas sobre la mesa. Cuando se encuentren todos los pares iguales, la persona con más pares iguales ganará el juego. Al igual que Omok, necesitarás#bUn juego de cartas de partido#kpara abrir la sala de juegos.");

        } else if (selection == 4) {
            current = 3;
            cm.sendNext("Quieres jugar #bOmok#k, ¿eh? Para jugarlo, necesitarás el Omok Set. Sólo los que tienen ese objeto pueden abrir la sala para jugar a Omok, y puedes jugar a este juego en casi cualquier lugar excepto en algunos lugares del mercado.");

        } else if (selection == 5) {
            current = 4;
            if (cm.haveItem(4030012, 15)) {
                cm.gainItem(4030012, -15);
                cm.gainItem(4080100, 1);
                cm.dispose();
            } else {
                cm.sendNext("Quieres#bUn juego de cartas de partido#k? Hmm... para hacer un juego de Match Cards, necesitarás algunas#bCartas de monstruos#k. Monster Card se puede obtener eliminando los monstruos de toda la isla. Recoge 15 Cartas de Monstruo y podrás hacer un conjunto de Cartas de Partido."); //Lmfao a set of A set xD
                cm.dispose();
            }
        }


    } else if (status == 3) {
        if (current == 1) {
            cm.sendNextPrev("Cada partida de Omok te costará#r100 mesos#k. Incluso si no tienes un#bConjunto Omok#k, puedes entrar a la habitación y jugar. Sin embargo, si no posees 100 mesos, no se te permitirá entrar a la habitación en absoluto. La persona que abre la sala de juegos también necesita 100 mesos para abrir la sala (de lo contrario no habrá juego). Si te quedas sin mesos durante el juego, ¡serás expulsado automáticamente de la sala!");
        } else if (current == 2) {
            cm.sendNextPrev("Cada juego de Match Cards te costará#r100 mesos#k. Incluso si no tienes#bUn juego de cartas de partido#k, puedes entrar a la habitación y jugar. Sin embargo, si no posees 100 mesos, no se te permitirá entrar a la habitación en absoluto. La persona que abre la sala de juegos también necesita 100 mesos para abrir la sala (de lo contrario no habrá juego). Si te quedas sin mesos durante el juego, ¡serás expulsado automáticamente de la sala!");

        } else if (current == 3) {
            for (var i = 0; i < omok.length; i++) {
                text += "\r\n#L" + i + "##b#t" + omok[i] + "##k#l";
            }
            cm.sendSimple(text);
        }

    } else if (status == 4) {
        if (current == 1 || current == 2) {
            cm.sendNextPrev("Ingrese a la sala y, cuando esté listo para jugar, haga clic en #bReady#k.\r\nO. Una vez que el visitante haga clic en #bReady#k, el propietario de la sala puede presionar #bStart#k para comenzar el juego. Si entra un visitante no deseado y usted no quiere jugar con esa persona, el propietario de la sala tiene derecho a expulsar al visitante de la sala. Habrá un cuadro cuadrado con una x escrita a la derecha de esa persona. Haz clic en eso para despedirte fríamente, ¿vale?"); //Oh yeah, because people WALK in Omok Rooms.
        } else if (current == 3) {
            if (cm.haveItem(omok1piece[selection], omokamount) && cm.haveItem(omok2piece[selection], omokamount) && cm.haveItem(4030009, 1)) {
                cm.gainItem(omok1piece[selection], -omokamount);
                cm.gainItem(omok2piece[selection], -omokamount);
                cm.gainItem(4030009, -1);
                cm.gainItem(omok[selection], 1);
                cm.dispose();
            } else {
                cm.sendNext("#bquieres hacer#t" + omok[selection] + "##k? Hmm... consígueme los materiales y puedo hacer precisamente eso. Escucha atentamente, los materiales que necesitarás serán:#r" + omokamount + " #t" + omok1piece[selection] + "#, " + omokamount + " #t" + omok2piece[selection] + "#, 1 #t" + 4030009 + "##k. Los monstruos probablemente los dejarán caer de vez en cuando...");
                cm.dispose();
            }
        }

    } else if (status == 5) {
        if (current == 1) {
            cm.sendNextPrev("Cuando comienza el primer juego,#bel dueño de la habitación va primero#k. Tenga en cuenta que se le dará un límite de tiempo y puede perder su turno si no realiza su movimiento a tiempo. Normalmente, 3 x 3 no está permitido, pero si llega un momento en el que es absolutamente necesario poner tu pieza allí o afrontar el final del juego, entonces puedes ponerla allí. ¡Se permite el 3 x 3 como última línea de defensa! Ah, y no contará si es#r6 o 7 seguidos#k. ¡Solo 5!");
        } else if (current == 2) {
            cm.sendNextPrev("Ah, y a diferencia de Omok, cuando creas la sala de juego para Match Cards, necesitarás configurar tu juego según la cantidad de cartas que usarás para el juego. Hay 3 modos disponibles, 3x4, 4x5 y 5x6, que requerirán 12, 20 y 30 tarjetas respectivamente. Recuerda que no podrás cambiarlo una vez que la sala esté abierta, por lo que si realmente deseas cambiarlo, es posible que tengas que cerrar la sala y abrir otra.");
        }

    } else if (status == 6) {
        if (current == 1) {
            cm.sendNextPrev("Si sabe que está contra la pared, puede solicitar un #bRedo#k. Si el oponente acepta tu solicitud, entonces tus últimos movimientos y los de tu oponente se cancelarán. Si alguna vez siente la necesidad de ir al baño o tomar un descanso prolongado, puede solicitar un #btie#k. El juego terminará en empate si el oponente acepta la solicitud. Consejo: esta puede ser una buena manera de mantener intactas tus amistades.");
        } else if (current == 2) {
            cm.sendNextPrev("Cuando comienza el primer juego,#bel dueño de la habitación va primero.#kTenga en cuenta que se le dará un límite de tiempo y puede perder su turno si no realiza su movimiento a tiempo. Cuando encuentres un par de cartas iguales en tu turno, podrás mantener tu turno, siempre y cuando sigas encontrando un par de cartas iguales. Usa tus habilidades de memorización para hacer una racha.");
        }

    } else if (status == 7) {
        if (current == 1) {
            cm.sendPrev("Cuando comience el siguiente juego, el perdedor irá primero. Además, nadie puede salir en medio de un juego. Si lo hace, es posible que deba solicitar un#bperder o empatar#k. (Por supuesto, si solicitas una pérdida, perderás el juego). Y si haces clic en 'Salir' en medio del juego y llamas para salir después del juego, abandonarás la sala inmediatamente después de que termine el juego. Esta será una forma mucho más útil de irse.");
            cm.dispose();
        } else if (current == 2) {
            cm.sendNextPrev("Si usted y su oponente tienen la misma cantidad de pares coincidentes, entonces ganará quien tenga una racha más larga de pares coincidentes. Si alguna vez siente la necesidad de ir al baño o tomar un descanso prolongado, puede solicitar un #btie#k. El juego terminará en empate si el oponente acepta la solicitud. Consejo: esta puede ser una buena manera de mantener intactas tus amistades.");
        }
    } else if (status == 8) {
        if (current == 2) {
            cm.sendPrev("Cuando comience el siguiente juego, el perdedor irá primero. Además, nadie puede salir en medio de un juego. Si lo hace, es posible que deba solicitar un#bperder o empatar#k. (Por supuesto, si solicitas una pérdida, perderás el juego). Y si haces clic en 'Salir' en medio del juego y llamas para salir después del juego, abandonarás la sala inmediatamente después de que termine el juego. Esta será una forma mucho más útil de irse.");
            cm.dispose();
        }
    }
}  