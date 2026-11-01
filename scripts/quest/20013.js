/*
	NPC Name: 		Kia
	Description: 		Quest - Cygnus tutorial helper
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 2) {
            qm.sendNext("Hmm, ¿era demasiado pedir? ¿Es porque no sabes romper cajas? Te diré cómo si aceptas mi Quest. Déjame saber si cambias de opinión.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("#b(*sonido metálico*)#k");
    } else if (status == 1) {
        qm.sendNextPrev("¡Vaya! ¡Ey! Me asustaste. No sabía que tenía una visita. Debes ser el Noblesse del que hablaba #p1102006#. ¡Bienvenido! Soy #p1102007# y mi pasatiempo es fabricar #bChairs#k. Estoy pensando en hacerte uno como regalo de bienvenida.");
    } else if (status == 2) {
        qm.sendNextPrev("Pero espera, no puedo hacerte uno porque no tengo suficientes materiales. ¿Podrías encontrarme los materiales que necesito? Alrededor de esta área encontrarás muchas cajas con artículos en su interior. ¿Podrías traerme un #t4032267# y un #t4032268# que se encuentran dentro de esas cajas?");
    } else if (status == 3) {
        qm.sendNextPrev("¿Sabes cómo sacar artículos de las cajas? Todo lo que tienes que hacer es romper las Cajas como si estuvieras atacando a un monstruo. La diferencia es que puedes atacar monstruos usando tus habilidades, pero puedes#bSolo usa ataques regulares para romper cajas.#k.");
    } else if (status == 4) {
        qm.sendAcceptDecline("por favor tráeme 1#b#t4032267##ky 1#b#t4032268##kencontrado dentro de esas Cajas. Te haré una silla increíble tan pronto como tenga lo que necesito. ¡Esperaré aquí!");
    } else if (status == 5) {
        qm.forceStartQuest();
        qm.guideHint(9);
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        qm.sendNext("¿Me trajiste una piedra de construcción y una cortina? Vamos a ver. ¡Ah, esto es justo lo que necesito! ¡De hecho son un #t4032267# y un #t4032268#! Te haré una silla ahora mismo.");
    } else if (status == 1) {
        qm.sendPrev("Aquí está, un#t3010060#. ¿Qué opinas? Genial, ¿eh? Puede#brecupera rápidamente tu HP sentándote en esta silla#k. Se almacenará en el#bConfiguración#kventana en su Inventario, así que confirme que ha recibido la silla y diríjase a#b#p1102008##k. Lo verás si sigues la flecha hacia la izquierda.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i3010060# 1 #t3010060# \r\n#fUI/UIWindow.img/QuestIcon/8/0# 95 exp.");
    } else if (status == 2) {
        qm.gainItem(4032267, -1);
        qm.gainItem(4032268, -1);
        qm.gainItem(3010060, 1);
        qm.forceCompleteQuest();
        qm.forceCompleteQuest(20000);
        qm.forceCompleteQuest(20001);
        qm.forceCompleteQuest(20002);
        qm.forceCompleteQuest(20015);
        qm.gainExp(95);
        qm.guideHint(10);
        qm.dispose();
    }
}