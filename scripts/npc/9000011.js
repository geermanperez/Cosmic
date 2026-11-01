var quantities = Array(10, 8, 6, 5, 4, 3, 2, 1, 1, 1);
var prize1 = Array(1442047, 2000000, 2000001, 2000002, 2000003, 2000004, 2000005, 2430036, 2430037, 2430038, 2430039, 2430040); //1 day
var prize2 = Array(1442047, 4080100, 4080001, 4080002, 4080003, 4080004, 4080005, 4080006, 4080007, 4080008, 4080009, 4080010, 4080011);
var prize3 = Array(1442047, 1442048, 2022070);
var prize4 = Array(1442048, 2430082, 2430072); //7 day
var prize5 = Array(1442048, 2430091, 2430092, 2430093, 2430101, 2430102); //10 day
var prize6 = Array(1442048, 1442050, 2430073, 2430074, 2430075, 2430076, 2430077); //15 day
var prize7 = Array(1442050, 3010183, 3010182, 3010053, 2430080); //20 day
var prize8 = Array(1442050, 3010178, 3010177, 3010075, 1442049, 2430053, 2430054, 2430055, 2430056, 2430103, 2430136); //30 day
var prize9 = Array(1442049, 3010123, 3010175, 3010170, 3010172, 3010173, 2430201, 2430228, 2430229); //60 day
var prize10 = Array(1442049, 3010172, 3010171, 3010169, 3010168, 3010161, 2430117, 2430118, 2430119, 2430120, 2430137); //1 year
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendNext("Hola, soy #p" + cm.getNpc() + "#k, si no estás ocupado y todo... entonces ¿puedo salir contigo? He oído que hay gente reunida por aquí para una#revent#k pero no quiero ir solo... Bueno, ¿quieres ir a comprobarlo conmigo?");
        } else if (status == 1) {
            cm.sendSimple("¿Eh? ¿Qué tipo de evento? Bueno, eso es...\r\n#L0##e1.#n#b¿Qué tipo de evento es?#k#l\r\n#L1##e2.#n#bExplícame el juego del evento.#k#l\r\n#L2##e3.#n#b¡Muy bien, vámonos!#k#l\r\n#L3##e4.#n#bCambie el certificado de ganancia directa por un artículo de recompensa.#k#l");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendNext("¡Todo este mes, MapleStory Global celebra su tercer aniversario! Los GM llevarán a cabo eventos sorpresa para GM durante todo el evento, ¡así que mantente alerta y asegúrate de participar en al menos uno de los eventos para obtener grandes premios!");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendSimple("Hay muchos juegos para este evento. Te ayudará mucho saber cómo jugar antes de jugarlo. ¡Elige el que quieras saber más!#b\r\n#L0#vivir la vida#l\r\n#L1#Prueba de aptitud física MapleStory Maple#l\r\n#L2#bola de nieve#l\r\n#L3#Cosecha de coco#l\r\n#L4#Prueba de buey#l\r\n#L5#Búsqueda del tesoro#l#k");
            } else if (selection == 2) {
                var marr = cm.getQuestRecord(100295);
                if (marr.getCustomData() == null) {
                    marr.setCustomData("0");
                }
                var dat = parseInt(marr.getCustomData());
                if (dat + 3600000 >= cm.getCurrentTime()) {
                    cm.sendNext("Ya ingresaste al evento en la última hora.");
                } else if (!cm.canHold(4031019)) {
                    cm.sendNext("Ahorre algo de espacio en su inventario.");
                } else if (cm.getChannelServer().getEvent() > -1 && !cm.haveItem(4031019)) {
                    cm.getPlayer().saveLocation("EVENT");
                    cm.getPlayer().setChalkboard(null);
                    marr.setCustomData("" + cm.getCurrentTime());
                    cm.warp(cm.getChannelServer().getEvent(), cm.getChannelServer().getEvent() == 109080000 || cm.getChannelServer().getEvent() == 109080010 ? 0 : "join00");
                } else {
                    cm.sendNext("O el evento no se ha iniciado, ya tienes el#bPergamino de los secretos#k, o ya has participado en este evento en las últimas 24 horas. ¡Inténtelo de nuevo más tarde!");
                }
                cm.dispose();
            } else if (selection == 3) {
                var selStr = "Which Certificate of straight Win do you wish to exchange?";
                for (var i = 0; i < quantities.length; i++) {
                    selStr += "\r\n#b#L" + i + "##t" + (4031332 + i) + "# Exchange(" + quantities[i] + ")#l";
                }
                cm.sendSimple(selStr);
                status = 9;
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendNext("#b[Vive la vida]#kEs un juego donde los participantes suben escaleras para llegar a la cima. Sube y pasa al siguiente nivel eligiendo el portal correcto entre los numerosos portales disponibles.\r\n\r\nEl juego consta de tres niveles y el límite de tiempo es#b6 MINUTOS#k. Durante [Ola Ola], tú#bNo podrás saltar, teletransportarte, acelerar ni aumentar tu velocidad usando pociones u objetos.#k. También hay portales de trucos que te llevarán a un lugar extraño, así que ten cuidado con ellos.");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("#b[Prueba de aptitud física de MapleStory] es una carrera a través de una carrera de obstáculos#kmuy parecido al Bosque de la Paciencia. Puedes ganarlo superando varios obstáculos y llegar al destino final dentro del límite de tiempo.\r\n\r\nEl juego consta de cuatro niveles y el límite de tiempo es#b15 MINUTOS#k. Durante la [Prueba de aptitud física de MapleStory], no podrás usar el teletransporte ni la prisa.");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendNext("#b[Bola de nieve]#kconsta de dos equipos, Maple Team y Story Team, y los dos equipos se enfrentan para ver#b¿Qué equipo hizo rodar la bola de nieve más lejos y más grande en un tiempo limitado?#k. Si el juego no se puede decidir dentro del período de tiempo, entonces gana el equipo que hizo rodar la bola de nieve más lejos.\r\n\r\nPara enrollar la nieve, atácala presionando#bCtrl#k. Todos los ataques de largo alcance y los ataques basados ​​en habilidades no funcionarán aquí.#bSólo los ataques de corto alcance funcionarán.#k. \r\n\r\nSi un personaje toca la bola de nieve, será enviado de regreso al punto de partida. Ataca al muñeco de nieve frente al punto de partida para evitar que el equipo contrario haga rodar la nieve hacia adelante. Aquí es donde funciona una estrategia bien planificada, ya que el equipo decidirá si atacar a la bola de nieve o al muñeco de nieve.");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendNext("#b[Cosecha de coco]#kconsta de dos equipos, Maple Team y Story Team, y los dos equipos se enfrentan para ver#b¿Qué equipo recoge más cocos?#k. El límite de tiempo es#b5 MINUTOS#k. Si el juego termina en empate, se concederán 2 minutos adicionales para determinar el ganador. Si por alguna razón el marcador sigue empatado, el juego terminará en empate.\r\n\r\nTodos los ataques de largo alcance y los ataques basados ​​en habilidades no funcionarán aquí.#bSólo los ataques de corto alcance funcionarán.#k. Si no tienes un arma para los ataques a corta distancia, puedes comprarla a través de un NPC dentro del mapa del evento. No importa el nivel del personaje, el arma o las habilidades, todos los daños aplicados serán los mismos.\r\n\r\nCuidado con los obstáculos y trampas dentro del mapa. Si el personaje muere durante el juego, será eliminado del juego. Gana el jugador que golpee el último antes de que caiga el coco. Sólo cuentan los cocos que golpean el suelo, lo que significa que los que no se caen del árbol, o la explosión ocasional de los cocos NO CONTARÁ. También hay un portal oculto en uno de los caparazones en la parte inferior del mapa, ¡así que úsalo sabiamente!");
                cm.dispose();
            } else if (selection == 4) {
                cm.sendNext("#b[Prueba de BUEY]#kes un juego de inteligencia de MapleStory a través de X y O. Una vez que te unas al juego, enciende el minimapa presionando#bM#k para ver dónde están la X y la O. Un total de#r10 preguntas#kSe darán, y el personaje que las responda todas correctamente gana el juego.\r\n\r\nUna vez dada la pregunta, usa la escalera para ingresar al área donde puede estar la respuesta correcta, ya sea X u O. Si el personaje no elige una respuesta o queda colgado de la escalera más allá del límite de tiempo, el personaje será eliminado. Mantenga su posición hasta que [CORRECTO] desaparezca de la pantalla antes de continuar. Para evitar trampas de cualquier tipo, todos los tipos de chat se desactivarán durante el OX Quiz.");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("#b[Búsqueda del tesoro]#kes un juego en el que tu objetivo es encontrar el#brollos del tesoro#kque están escondidos por todo el mapa#ren 10 minutos#k. Habrá una serie de cofres del tesoro misteriosos escondidos y, una vez que los rompas, muchos elementos emergerán del cofre. Tu trabajo es seleccionar el pergamino del tesoro entre esos elementos.\r\nLos cofres del tesoro se pueden destruir usando#bataques regulares#k, y una vez que tengas el pergamino del tesoro en posesión, puedes cambiarlo por el Pergamino de los Secretos a través de un NPC que está a cargo del intercambio de artículos. El NPC comercial se puede encontrar en el mapa de Treasure Hunt, pero también puedes intercambiar tu pergamino.#bVikin#k de Lith Harbor.\r\n\r\nEste juego tiene su parte de portales ocultos y puntos de teletransportación ocultos. Para usarlos, presione el#bflecha arriba#ken un lugar determinado y serás teletransportado a un lugar diferente. Intenta saltar, ya que también puedes toparte con escaleras o cuerdas ocultas. También habrá un cofre del tesoro que te llevará a un lugar escondido y un cofre oculto que solo se puede encontrar a través del portal oculto, así que intenta mirar a tu alrededor.\r\n\r\nDurante el juego de Treasure Hunt, todas las habilidades de ataque serán#rdisabled#k, así que rompe el cofre del tesoro con el ataque normal.");
                cm.dispose();
            }
        } else if (status == 10) {
            if (selection < 0 || selection > quantities.length) {
                return;
            }
            var ite = 4031332 + selection;
            var quan = quantities[selection];
            var pri;
            switch (selection) {
                case 0:
                    pri = prize1;
                    break;
                case 1:
                    pri = prize2;
                    break;
                case 2:
                    pri = prize3;
                    break;
                case 3:
                    pri = prize4;
                    break;
                case 4:
                    pri = prize5;
                    break;
                case 5:
                    pri = prize6;
                    break;
                case 6:
                    pri = prize7;
                    break;
                case 7:
                    pri = prize8;
                    break;
                case 8:
                    pri = prize9;
                    break;
                case 9:
                    pri = prize10;
                    break;
                default:
                    cm.dispose();
                    return;
            }
            var rand = Math.floor(Math.random() * pri.length);
            if (!cm.haveItem(ite, quan)) {
                cm.sendOk("Necesitas #b" + quan + " #t" + ite + "##k para cambiarlo por el artículo.");
            } else if (cm.getInventory(1).getNextFreeSlot() <= -1 || cm.getInventory(2).getNextFreeSlot() <= -1 || cm.getInventory(3).getNextFreeSlot() <= -1 || cm.getInventory(4).getNextFreeSlot() <= -1) {
                cm.sendOk("Necesitas espacio para este artículo.");
            } else {
                cm.gainItem(pri[rand], 1);
                cm.gainItem(ite, -quan);
                cm.gainMeso(100000 * selection); //temporary prize lolol
            }
            cm.dispose();
        }
    }
}