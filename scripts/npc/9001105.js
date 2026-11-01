var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            if (cm.getPlayer().getMapId() == 922240200) {
                cm.sendOk("Es una pena, vuelve cuando estés listo.");
            }

            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.getMapId() == 922240200) {
                cm.sendSimple("¿Tenías algo que decir...?#b\b\r\n#L0#Quiero rescatar a Gaga.#l\r\n");    //#L1#I want to go to the Space Mine.#l
            } else if (cm.getMapId() >= 922240000 && cm.getMapId() <= 922240019) {
                cm.sendYesNo("No te preocupes si fallas. Tendrás 3 oportunidades. ¿Todavía quieres rendirte?");
            } else if (cm.getMapId() >= 922240100 && cm.getMapId() <= 922240119) {
                var text = "You went through so much trouble to rescue Gaga, but it looks like we're back to square one. ";
                var rgaga = cm.getPlayer().getEvents().get("rescueGaga");
                if (rgaga.getCompleted() > 10) {
                    text += "Please don't give up until Gaga is rescued. To show you my appreciation for what you've accomplished thus far, I've given you a Spaceship. It's rather worn out, but it should still be operational. Check your #bSkill Window#k.";
                    rgaga.giveSkill(cm.getPlayer());
                } else {
                    text += "Let's go back now.";
                }

                cm.sendNext(text);
            }
        } else {
            if (cm.getPlayer().getMapId() == 922240200) {
                if (status == 1) {
                    if (selection == 0) {
                        selected = 1;
                        cm.sendNext("¡Bienvenido! Escuché lo que pasó de Baby Moon Bunny. Me alegra que hayas venido ya que estaba planeando solicitar ayuda. Gaga es una amiga mía que me ha ayudado antes y a menudo pasa a saludarme. Desafortunadamente, fue secuestrado por extraterrestres.");
                    } else {
                        selected = 2;
                        cm.sendYesNo("En la Mina Espacial, puedes encontrar minerales especiales llamados#bCriptocristales#kque contiene el misterioso poder del espacio.#bCriptocristales#lGeneralmente son de color esmeralda, pero se vuelven marrones si se golpean con la nave espacial.#bHaz espacial#k. Recuerde, para frustrar esta conspiración alienígena,#bSe necesitan 10 Krypto Crystal's marrones y 10 Krypto Crystal's esmeralda. Pero desde incluso#b1 criptocristal#kPuede ser de ayuda, tráeme tantos como sea posible. ¡Ah, y una cosa más! Las Minas Espaciales están protegidas por los Mateons Espaciales. Son extremadamente fuertes debido al poder del#Kcristales criptográficos#k, así que no intentes derrotarlos. Simplemente concéntrate en recolectar rápidamente los cristales.");
                    }
                } else if (status == 2) {
                    if (selected == 1) {
                        cm.sendYesNo("¡Si dejamos a Gaga con los extraterrestres, le sucederá algo terrible! Te dejaré prestada una nave espacial que los Moon Bunnies usan para viajar para que puedas rescatar a Gaga.#bAunque a veces puede parecer un poco indeciso, lento e inmaduro.#k, es realmente un joven agradable. ¿Quieres ir a rescatarlo ahora?");
                    } else if (selected == 2) {
                        cm.sendOk("Aún no codificado, f4.");
                        cm.dispose();
                    }
                } else if (status == 3) {
                    var em = cm.getEventManager("RescueGaga");
                    if (em == null) {
                        cm.sendOk("Este evento no está disponible actualmente.");
                    } else if (!em.startInstance(cm.getPlayer())) {
                        cm.sendOk("Actualmente hay alguien en este mapa, vuelve más tarde.");
                    }

                    cm.dispose();
                }
            } else if (cm.getPlayer().getMapId() >= 922240000 && cm.getPlayer().getMapId() <= 922240019) {
                cm.warp(922240200, 0);
                cm.dispose();
            } else if (cm.getPlayer().getMapId() >= 922240100 && cm.getPlayer().getMapId() <= 922240119) {
                cm.warp(922240200, 0);
                cm.dispose();
            }
        }
    }
}