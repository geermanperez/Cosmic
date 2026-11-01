/*
 * Cygnus 1st Job advancement - Night Walker
 */

var status = -1;
var jobType = 4;
var canTryFirstJob = true;

function end(mode, type, selection) {
    if (mode == 0) {
        if (status == 0) {
            qm.sendNext("Esta es una decisión importante que tomar.");
            qm.dispose();
            return;
        }
        status--;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendYesNo("¿Has tomado tu decisión? La decisión será definitiva, así que piénselo bien antes de decidir qué hacer. ¿Estás seguro de que quieres convertirte en Night Walker?");
    } else if (status == 1) {
        if (canTryFirstJob) {
            canTryFirstJob = false;
            if (qm.getPlayer().getJob().getId() != 1400) {
                if (!qm.canGetFirstJob(jobType)) {
                    qm.sendOk("Entrena un poco más hasta llegar a #bnivel 10," + qm.getFirstJobStatRequirement(jobType) + "#ky puedo mostrarte el camino del#rCaminante nocturno#k.");
                    qm.dispose();
                    return;
                }

                if (!(qm.canHoldAll([1472061, 1142066]) && qm.canHold(2070000))) {
                    qm.sendOk("Haz algo de espacio en tu inventario y habla conmigo.");
                    qm.dispose();
                    return;
                }

                qm.gainItem(1472061, 1);
                qm.gainItem(2070000, 800);
                qm.gainItem(1142066, 1);
                const Job = Java.type('client.Job');
                qm.changeJob(Job.NIGHTWALKER1);
                qm.getPlayer().resetStats();
            }
            qm.forceCompleteQuest();
        }
        qm.sendNext("Acabo de moldear tu cuerpo para hacerlo perfecto para un Night Walker. Si deseas ser más poderoso, usa la ventana de estadísticas (S) para aumentar las estadísticas apropiadas. Si no está seguro de qué recaudar, simplemente haga clic en #bAuto#k.");
    } else if (status == 2) {
        qm.sendNextPrev("También he ampliado el número de espacios de inventario para su equipo, etc. Utilice esos espacios con prudencia y llénelos con los elementos necesarios para que los lleven los Caballeros.");
    } else if (status == 3) {
        qm.sendNextPrev("También te he dado una pista de#bSP#k, entonces abre el#bMenú de habilidades#kpara adquirir nuevas habilidades. Por supuesto, no puedes criarlos en absoluto una vez, y hay algunas habilidades que no podrás adquirir a menos que primero domines las habilidades básicas.");
    } else if (status == 4) {
        qm.sendNextPrev("A diferencia de tu época como Noblesse, una vez que te conviertas en Night Walker, perderás una parte de tu EXP cuando te quedes sin HP, ¿de acuerdo?");
    } else if (status == 5) {
        qm.sendNextPrev("Ahora... quiero que salgas y le muestres al mundo cómo operan los Caballeros de Cygnus.");
    } else if (status == 6) {
        qm.dispose();
    }
}