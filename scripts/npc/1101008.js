function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendSimple("¡Esperar! Descubrirás todo cuando llegues al nivel Lv. 10 de todos modos, pero si absolutamente deseas prepararte de antemano, puedes ver la siguiente información.\r\n\r\nCuéntame, ¿qué te gustaría saber?\r\n#b#L0#Acerca de ti#l\r\n#L1#Minimapa#l\r\n#L2#Ventana de misión#l\r\n#L3#Inventario#l\r\n#L4#Caza de ataque regular#l\r\n#L5#Cómo recoger artículos#l\r\n#L6#Cómo equipar artículos#l\r\n#L7#Ventana de habilidades#l\r\n#L8#Cómo utilizar las tragamonedas rápidas#l\r\n#L9#Cómo romper cajas#l\r\n#L10#Cómo sentarse en una silla#l\r\n#L11#Mapa mundial#l\r\n#L12#Notificaciones de misiones#l\r\n#L13#Mejora de estadísticas#l\r\n#L14#¿Quiénes son los Caballeros Cygnus?#l");
        } else if (status == 1) {
            if (selection == 0) {
                cm.sendNext("Sirvo bajo las órdenes de Shinsoo, el guardián de la emperatriz Cygnus. Mi maestro, Shinsoo, me ha ordenado guiar a todos los que vienen a Maple World para unirse a Cygnus Knights. Te ayudaré y seguiré hasta que te conviertas en Caballero o alcances el nivel Lv. 11. Por favor, hágamelo saber si tiene alguna pregunta.");
            } else if (selection == 1) {
                cm.guideHint(1);
                cm.dispose();
            } else if (selection == 2) {
                cm.guideHint(2);
                cm.dispose();
            } else if (selection == 3) {
                cm.guideHint(3);
                cm.dispose();
            } else if (selection == 4) {
                cm.guideHint(4);
                cm.dispose();
            } else if (selection == 5) {
                cm.guideHint(5);
                cm.dispose();
            } else if (selection == 6) {
                cm.guideHint(6);
                cm.dispose();
            } else if (selection == 7) {
                cm.guideHint(7);
                cm.dispose();
            } else if (selection == 8) {
                cm.guideHint(8);
                cm.dispose();
            } else if (selection == 9) {
                cm.guideHint(9);
                cm.dispose();
            } else if (selection == 10) {
                cm.guideHint(10);
                cm.dispose();
            } else if (selection == 11) {
                cm.guideHint(11);
                cm.dispose();
            } else if (selection == 12) {
                cm.guideHint(12);
                cm.dispose();
            } else if (selection == 13) {
                cm.guideHint(13);
                cm.dispose();
            } else if (selection == 14) {
                cm.sendOk("El Mago Negro está tratando de revivir y conquistar nuestro pacífico Maple World. Como respuesta a esta amenaza, la emperatriz Cygnus ha formado una caballería, ahora conocida como Cygnus Knights. Puedes convertirte en Caballero cuando alcances el nivel. 10.");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("No es necesario que verifiques esta información ahora. Estos son conceptos básicos que aprenderás mientras juegas. Siempre puedes hacerme las preguntas que surjan después de haber alcanzado el nivel Lv. 10, así que relájate.");
            cm.dispose();
        }
    }
}