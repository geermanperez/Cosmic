/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            qm.sendNext("¿No quieres esforzarte para conseguir el arma definitiva?");
        }
        qm.dispose();
        return;
    }
    if (status == 0) {
        qm.sendNext("Hmm... ¿Qué hace una persona joven como tú en este lugar apartado?");
    } else if (status == 1) {
        qm.sendNextPrev("¡He venido a buscar la mejor arma de asta que existe!", 2);
    } else if (status == 2) {
        qm.sendNextPrev("¿La mejor arma de asta? Deberías poder comprarlo en alguna ciudad u otro lugar.");
    } else if (status == 3) {
        qm.sendNextPrev("¡He oído que eres el mejor herrero de todo Maple World! ¡Quiero nada menos que un arma hecha por ti!", 2);
    } else if (status == 4) {
        qm.sendAcceptDecline("Ahora soy demasiado mayor para fabricar armas, pero... tengo un arma de asta que hice hace mucho tiempo. Todavía está en excelente forma. Pero no puedo dártela porque esa arma de asta es extremadamente afilada, tan afilada que podría herir a su amo. ¿Aún lo quieres?");
    } else if (status == 5) {
        qm.sendOk("Bueno, si tú lo dices... no puedo objetar eso. Te diré qué. Te haré una prueba rápida y, si la pasas, el arma de asta gigante será tuya. Dirígete al#bCentro de formación#ky asumir el#rOsos marcados#kque están ahí. Tu trabajo es traer de vuelta#b30 Signo de Aceptaciones#k.");
    } else if (status == 6) {
        qm.startQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            qm.sendNext("¿Mmm? ¿Dudas en tomarlo ahora después de todo eso? Bueno, piénsalo más si quieres. Al final será tuyo de todos modos.");
        }
        qm.dispose();
        return;
    }
    if (status == 0) {
        if (qm.haveItem(4032311, 30)) {
            qm.sendNext("Oh, ¿me has traído el #t4032311#? ¡Eres más fuerte de lo que pensaba! Pero lo más importante es que estoy impresionado con la cantidad de coraje que demostró cuando aceptó tomar esta peligrosa arma sin dudarlo. Te lo mereces. El #p1201001# es tuyo.");
        } else {
            qm.sendNext("Elija el 30 #t4032311#.");
            qm.dispose();
        }
    } else if (status == 1) {
        qm.sendNextPrev("#b(Después de mucho tiempo pasado,#p1203000#te entrego el#p1201001#, que estaba cuidadosamente envuelto en tela.)");
    } else if (status == 2) {
        qm.sendYesNo("Toma, esta es #p1201002#, el arma de asta que has pedido. Por favor cuídalo bien.");
    } else if (status == 3) {
        //qm.showVideo("Polearm");
        qm.completeQuest();
        qm.removeAll(4032311);
        qm.dispose();
    }
}