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
        if (mode == 0 && type == 12) {
            qm.sendNext("Vuelve cuando hayas tomado sabiamente tu decisión.");
        }
        qm.dispose();
        return;
    }
    if (status == 0) {
        qm.sendAcceptDecline("¿Cómo va el entrenamiento? ¡Vaya, has alcanzado un nivel tan alto! Eso es asombroso. Sabía que te iría bien en la Isla Victoria... Oh, mírame. Estoy perdiendo tu tiempo. Sé que estás ocupado, pero tendrás que regresar un rato a la isla.");
    } else if (status == 1) {
        qm.sendOk("Su#b#p1201001##ken#b#m140000000##kestá actuando extraño de repente. Según los registros, el arma de asta actúa de esta manera cuando llama a su maestro.#bQuizás te esté llamando#k. Por favor regresa a la isla y comprueba las cosas.");
    } else if (status == 2) {
        qm.startQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            qm.sendNext("¡Ey! ¡Al menos di que lo intentaste!");
        }
        qm.dispose();
        return;
    }
    if (status == 0) {
        qm.sendNext("Voom voom voom voom voom....");
    }//Giant Polearm
    else if (status == 1) {
        qm.sendNextPrev("#b(El#p1201001#está produciendo un eco ondulante. ¿Pero quién es ese chico que está parado ahí?)", 2);
    } else if (status == 2) {
        qm.sendNextPrev("#b(Nunca lo has visto antes. No parece humano).", 2);
    } else if (status == 3) {
        qm.sendNextPrev("¡Oye, Aran! ¿No me escuchas? Dije, ¡no me oyes! ¡Uf, qué frustrante!");
    } else if (status == 4) {
        qm.sendNextPrev("#b(¿Hm? ¿Quién era esa voz? Suena como la de un niño enojado...)", 2);
    } else if (status == 5) {
        qm.sendNextPrev("Uf, mi único maestro tuvo que terminar atrapado en el hielo durante cientos de años, abandonándome por completo, y ahora me ignora por completo.");
    } else if (status == 6) {
        qm.sendNextPrev("¿Quién eres?", 2);
    } else if (status == 7) {
        qm.sendNextPrev("¿Arán? ¿Me oyes ahora? ¡Soy yo! ¿No me reconoces? Soy tu arma,#b#p1201002#el arma de asta#k!");
    } else if (status == 8) {
        qm.sendNextPrev("#b(...#p1201002#? A#p1201001#puede hablar?)", 2);
    } else if (status == 9) {
        qm.sendNextPrev("¿Qué pasa con esa mirada sospechosa en tu cara? Sé que has perdido la memoria, pero ¿también te olvidaste de mí? ¡¿Cómo pudiste?!");
    } else if (status == 10) {
        qm.sendNextPrev("Lo siento mucho, pero no recuerdo nada.", 2);
    } else if (status == 11) {
        qm.sendYesNo("¡Lo siento, no es suficiente! ¿Sabes lo solo y aburrido que estuve durante cientos de años? ¡No me importa lo que haga falta! ¡Acuérdate de mí! ¡Recuérdame ahora!");
    } else if (status == 12) {
        qm.completeQuest();
        qm.sendNext("#b(La voz que dice ser#p1201002#el#p1201001#está gritando de frustración. No crees que esta conversación vaya a ninguna parte. Será mejor que vayas a hablar con#p1201000#primero.)", 2);
        //qm.sendNoExit("#b(La voz que dice ser#p1201002#el#p1201001#está gritando de frustración. No crees que esta conversación vaya a ninguna parte. Será mejor que vayas a hablar con#p1201000#primero.)", true);
    } else if (status == 13) {
        //qm.showVideo("Maha");
        qm.dispose();
    }
}