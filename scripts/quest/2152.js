var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("Ese árbol... ya había oído hablar de él antes, ¡incluso estudié su comportamiento! Si mal no recuerdo, el #bStumpy#k cobra vida cuando el suelo se considera infértil por algún tipo de magia, y esos tocones que evolucionan en estas condiciones comienzan a drenar estas sospechosas fuentes mágicas en lugar de agua y minerales para vivir, lo que los hace muy amenazantes para las personas y las aldeas cercanas.");
            qm.forceCompleteQuest();
        } else if (status == 1) {
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
    qm.dispose();
}