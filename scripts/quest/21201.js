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

function end(mode, type, selection) {
    if (mode == -1) {
        qm.sendNext("¡Ey! ¡Al menos di que lo intentaste!");
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.sendNext("¡Ey! ¡Al menos di que lo intentaste!");
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("Primero prometes derrotar al Mago Negro y convertirme en un arma famosa, luego me abandonas durante cientos de años y ahora me dices que no recuerdas quién soy. ¡¿Qué...?! ¿Crees que te dejaré salirte con la tuya? ¡Tú fuiste quien suplicó y suspiró por mí!");
        }//Giant Polearm
        else if (status == 1) {
            qm.sendNextPrev("Le dije a #p1203000# que me hiciera un brazo de asta si podía demostrar mi valía.", 2);
        } else if (status == 2) {
            qm.sendNextPrev("Después de tanto rogar, ¿no deberías tratarme con un poco más de amor y respeto? Ya sabes, un arma como yo es algo raro y maravilloso. Soy el #p1201001# definitivo que puede ayudarte a derrotar al Mago Negro. ¿Cómo pudiste abandonarme durante cientos de años?");
        } else if (status == 3) {
            qm.sendNextPrev("Oye, nunca rogué por ti.", 2);
        } else if (status == 4) {
            qm.sendNextPrev("¿Qué? ¿Nunca suplicaste por mí? ¡Ja! #p1203000# me dijo que te arrodillaste, suplicaste por mí entre lágrimas y... Espera un segundo. ¡Arán! ¿Acabas de recordar quién soy?");
        } else if (status == 5) {
            qm.sendNextPrev("Quizás un poquito...", 2);
        } else if (status == 6) {
            qm.sendNextPrev("¡Aran, eres tú! *Sniff sniff* Espera, *ejem* No me emocioné, son solo alergias. Sé que el Mago Negro te ha despojado de tus habilidades así que probablemente ni siquiera tengas fuerzas para levantarme... ¡pero al menos te acuerdas de mí! Me alegra que tu memoria esté empezando a regresar.");
        } else if (status == 7) {
            qm.sendAcceptDecline("Aunque hayas perdido la memoria, sigues siendo mi maestro. Pasaste por un entrenamiento muy duro en el pasado y estoy seguro de que tu cuerpo aún recuerda las habilidades que adquiriste en esos momentos difíciles. ¡Muy bien, restauraré tus habilidades!");
        } else if (status == 8) {
            if (!qm.isQuestCompleted(21201)) {
                if (!qm.canHold(1142130)) {
                    qm.sendOk("Vaya, su inventario #bequip#k está lleno. Necesito que hagas al menos 1 espacio vacío para completar esta misión.");   // thanks MedicOP for finding an issue here
                    return;
                }

                qm.gainItem(1142130, true);
                qm.changeJobById(2110);

                const YamlConfig = Java.type('config.YamlConfig');
                if (YamlConfig.config.server.USE_FULL_ARAN_SKILLSET) {
                    qm.teachSkill(21100000, 0, 20, -1);   //polearm mastery
                    qm.teachSkill(21100002, 0, 30, -1);   //final charge
                    qm.teachSkill(21100004, 0, 20, -1);   //combo smash
                    qm.teachSkill(21100005, 0, 20, -1);   //combo drain
                }

                qm.completeQuest();
            }

            qm.sendNext("Tu nivel no es el que solía ser en tus días de gloria, así que no puedo restaurar todas tus antiguas habilidades. Pero los pocos que puedo restaurar deberían ayudarte a subir de nivel más rápido. Ahora date prisa y entrena para que puedas volver a ser tu antiguo yo.");
        } else if (status == 9) {
            qm.dispose();
        }
    }
}