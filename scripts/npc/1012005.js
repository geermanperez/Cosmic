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
/* Author: Xterminator
	NPC Name: 		Cloy
	Map(s): 		Victoria Road : Henesys Park (100000200)
	Description: 		Pet Master
 */
var status = -2;
var sel;

function start() {
    status = -2
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == -1) {
            cm.sendNext("Hmm... ¿estás criando a uno de mis hijos por casualidad? Perfeccioné un hechizo que usa Agua de Vida para darle vida a una muñeca. La gente lo llama #bPet#k. Si tienes uno contigo, no dudes en hacerme preguntas.");
        } else if (status == 0) {
            cm.sendSimple("¿De qué quieres saber más?#b\r\n#L0#Cuéntame más sobre mascotas.#l\r\n#L1#¿Cómo crío mascotas?#l\r\n#L2#¿Las mascotas también mueren?#l\r\n#L3#¿Cuáles son los comandos para Brown y Black Kitty?#l\r\n#L4#¿Cuáles son los comandos para Brown Puppy?#l\r\n#L5#¿Cuáles son los comandos para Pink and White Bunny?#l\r\n#L6#¿Cuáles son los comandos para Mini Kargo?#l\r\n#L7#¿Cuáles son los comandos para Rudolph y Dasher?#l\r\n#L8#¿Cuáles son los comandos de Black Pig?#l\r\n#L9#¿Cuáles son los comandos para Panda?#l\r\n#L10#¿Cuáles son los comandos para Husky?#l\r\n#L11#¿Cuáles son los comandos para Dino Boy y Dino Girl?#l\r\n#L12#¿Cuáles son los comandos para Monkey?#l\r\n#L13#¿Cuáles son los comandos para Turquía?#l\r\n#L14#¿Cuáles son los comandos de White Tiger?#l\r\n#L15#¿Cuáles son los comandos de Penguin?#l\r\n#L16#¿Cuáles son los comandos de Golden Pig?#l\r\n#L17#¿Cuáles son los comandos para Robot?#l\r\n#L18#¿Cuáles son los comandos del Mini Yeti?#l\r\n#L19#¿Cuáles son los comandos para Jr. Balrog?#l\r\n#L20#¿Cuáles son los comandos para Baby Dragon?#l\r\n#L21#¿Cuáles son los comandos para el Dragón Verde/Rojo/Azul?#l\r\n#L22#¿Cuáles son los comandos para Black Dragon?#l\r\n#L23#¿Cuáles son los comandos para Jr. Reaper?#l\r\n#L24#¿Cuáles son los comandos de Porcupine?#l\r\n#L25#¿Cuáles son los comandos para Snowman?#l\r\n#L26#¿Cuáles son los comandos de Skunk?#l\r\n#L27#Por favor, enséñame cómo transferir puntos de habilidad de mascotas.#l");
        } else if (status == 1) {
            sel = selection;
            if (selection == 0) {
                status = 3;
                cm.sendNext("Entonces quieres saber más sobre las mascotas. Hace mucho tiempo hice una muñeca, la rocié con Agua de Vida y le lancé un hechizo para crear un animal mágico. Sé que suena increíble, pero es una muñeca que se convirtió en un ser vivo real. Entienden y siguen muy bien a las personas.");
            } else if (selection == 1) {
                status = 6;
                cm.sendNext("Dependiendo de la orden que le des, las mascotas pueden amarla, odiarla y mostrar otro tipo de reacciones. Si le das una orden a la mascota y te sigue bien, tu intimidad aumenta. Haz doble clic sobre la mascota y podrás comprobar la intimidad, nivel, plenitud y etc...");
            } else if (selection == 2) {
                status = 11;
                cm.sendNext("Morir... bueno, técnicamente no están VIVOS per se, así que no sé si morir es el término correcto a utilizar. Son muñecos con mi poder mágico y el poder del Agua de Vida para convertirse en un objeto vivo. Por supuesto, mientras está vivo, es como un animal vivo...");
            } else if (selection == 3) {
                cm.sendNext("Estos son los comandos para#rGatito marrón y gatito negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(Nivel 10 ~ 30)\r\n#bcutie#k (Nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 20 ~ 30)");
            } else if (selection == 4) {
                cm.sendNext("Estos son los comandos para#rCachorro marrón#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, perro malo, tonto#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bpee#k (Nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(Nivel 10 ~ 30)\r\n#bdown#k (Nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 20 ~ 30)");
            } else if (selection == 5) {
                cm.sendNext("Estos son los comandos para#rConejito rosa y conejito blanco#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(Nivel 10 ~ 30)\r\n#bhug#k (Nivel 10 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(Nivel 20 ~ 30)");
            } else if (selection == 6) {
                cm.sendNext("Estos son los comandos para#rMini carga#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bpee#k (Nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(Nivel 10 ~ 30)\r\n#bla mirada, el carisma#k(Nivel 10 ~ 30)\r\n#bdown#k (Nivel 10 ~ 30)\r\n#bbuen chico, buena chica#k(Nivel 20 ~ 30)");
            } else if (selection == 7) {
                cm.sendNext("Estos son los comandos para#rRudolph y Dasher#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bfeliz navidad, feliz navidad#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(Nivel 11 ~ 30)\r\n#bsolitario, solo#k(Nivel 11 ~ 30)\r\n#bcutie#k (Nivel 11 ~ 30)\r\n#bpapilla, vete#k(Nivel 21 ~ 30)");
            } else if (selection == 8) {
                cm.sendNext("Estos son los comandos para#rcerdo negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1~30)\r\n#bhand#k (Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#bsmile#k (Nivel 10 ~ 30)\r\n#bla mirada, el carisma#k(Nivel 20 ~ 30)");
            } else if (selection == 9) {
                cm.sendNext("Estos son los comandos para#rPanda#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#brelájate, relájate#k(Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#bletsplay#k (Nivel 10 ~ 30)\r\n#bcasi, bla#k(Nivel 10 ~ 30)\r\n#bsleep#k (Nivel 20 ~ 30)");
            } else if (selection == 10) {
                cm.sendNext("Estos son los comandos para#rHusky#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, perro malo, tonto#k(Nivel 1 ~ 30)\r\n#bhand#k (Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bdown#k (Nivel 10 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 20 ~ 30)");
            } else if (selection == 11) {
                cm.sendNext("Estos son los comandos para#rNiño Dino y Niña Dino#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bsonríe, ríe#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#bcutie#k (Nivel 10 ~ 30)\r\n#bdormir, siesta, sueño#k(Nivel 20 ~ 30)");
            } else if (selection == 12) {
                cm.sendNext("Estos son los comandos para#rMonkey#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#brest#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#bpee#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#bplay#k (Nivel 10 ~ 30)\r\n#bmelong#k (Nivel 10 ~ 30)\r\n#bdormir, gotobed, soñoliento#k(Nivel 20 ~ 30)");
            } else if (selection == 13) {
                cm.sendNext("Estos son los comandos para#rTurkey#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bno, chico rudo, travesura#k(Nivel 1 ~ 30)\r\n#bstupid#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, engullir#k(Nivel 10 ~ 30)\r\n#bsi, buen chico#k(Nivel 10 ~ 30)\r\n#bsomnoliento, siesta, dormitar#k(Nivel 20 ~ 30)\r\n#bojo de pájaro, acción de gracias, mosca, pájaro frito, tengo hambre#k(Nivel 30)");
            } else if (selection == 14) {
                cm.sendNext("Estos son los comandos para#rtigre blanco#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bdescansar, relajarse#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#bactúa triste, mirada triste#k(Nivel 10 ~ 30)\r\n#bwait#k (Nivel 20 ~ 30)");
            } else if (selection == 15) {
                cm.sendNext("Estos son los comandos para#rPenguin#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 10 ~ 30)\r\n#babrazo, abrázame#k(Nivel 10 ~ 30)\r\n#bala, mano#k(Nivel 10 ~ 30)\r\n#bsleep#k (Nivel 20 ~ 30)\r\n#bbeso, beso, beso#k(Nivel 20 ~ 30)\r\n#bfly#k (Nivel 20 ~ 30)\r\n#blindo, adorable#k(Nivel 20 ~ 30)");
            } else if (selection == 16) {
                cm.sendNext("Estos son los comandos para#rcerdo dorado#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 11 ~ 30)\r\n#bÁmame, abrázame#k(Nivel 11 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(Nivel 21 ~ 30)\r\n#bignorar / impresionado / fuera de aquí#k(Nivel 21 ~ 30)\r\n#brodar, mostrarme el dinero#k(Nivel 21 ~ 30)");
            } else if (selection == 17) {
                cm.sendNext("Estos son los comandos para#rRobot#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#batacar, cargar#k(Nivel 1 ~ 30)\r\n#biloveyou#k (Nivel 1 ~ 30)\r\n#bbueno, la mirada, carisma#k(Nivel 11 ~ 30)\r\n#bhablar, charlar, charlar, decir#k(Nivel 11 ~ 30)\r\n#bdisfrazar, cambiar, transformar#k(Nivel 11 ~ 30)");
            } else if (selection == 18) {
                cm.sendNext("Estos son los comandos para#rmini yeti#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bbailar, boogie, shakeit#k(Nivel 1 ~ 30)\r\n#blindo, chica, bonito, adorable#k(Nivel 1 ~ 30)\r\n#bte amo, me gustas, mi amor#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(Nivel 11 ~ 30)\r\n#bdormir, siesta, soñoliento, gotobed#k(Nivel 11 ~ 30)");
            } else if (selection == 19) {
                cm.sendNext("Estos son los comandos para#rJr. Balrog#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bliedown#k (Nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 1 ~ 30)\r\n#bte amo|mi amor|me gustas#k(Nivel 1 ~ 30)\r\n#blindo|lindo|bonito|adorable#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bsonrisa|torcida|risa#k(Nivel 1 ~ 30)\r\n#bmelong#k (Nivel 11 ~ 30)\r\n#bbueno|la mirada|carisma#k(Nivel 11 ~ 30)\r\n#bhablar|hablar|chatear|decir#k(Nivel 11 ~ 30)\r\n#bdormir|siesta|somnoliento#k(Nivel 11 ~ 30)\r\n#bgas#k (Nivel 21 ~ 30)");
            } else if (selection == 20) {
                cm.sendNext("Estos son los comandos para#rDragón bebé#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 1 ~ 30)\r\n#bte amo|te amo#k(Nivel 1 ~ 30)\r\n#bpoop#k (Nivel 1 ~ 30)\r\n#bestúpido|te odio|tonto#k(Nivel 1 ~ 30)\r\n#bcutie#k (Nivel 11 ~ 30)\r\n#bhablar|chatear|decir#k(Nivel 11 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(Nivel 11 ~ 30)");
            } else if (selection == 21) {
                cm.sendNext("Estos son los comandos para#rDragón verde/rojo/azul#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 15 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 15 ~ 30)\r\n#bte amo|te amo#k(Nivel 15 ~ 30)\r\n#bpoop#k (Nivel 15 ~ 30)\r\n#bestúpido|te odio|tonto#k(Nivel 15 ~ 30)\r\n#bhablar|chatear|decir#k(Nivel 15 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(Nivel 15 ~ 30)\r\n#bchange#k (Nivel 21 ~ 30)");
            } else if (selection == 22) {
                cm.sendNext("Estos son los comandos para#rDragón Negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 15 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 15 ~ 30)\r\n#bte amo|te amo#k(Nivel 15 ~ 30)\r\n#bpoop#k (Nivel 15 ~ 30)\r\n#bestúpido|te odio|tonto#k(Nivel 15 ~ 30)\r\n#bhablar|chatear|decir#k(Nivel 15 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(Nivel 15 ~ 30)\r\n#bchica, cambio#k(Nivel 21 ~ 30)");
            } else if (selection == 23) {
                cm.sendNext("Estos son los comandos para#rSegador Jr.#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 1 ~ 30)\r\n#bhacerse el muerto, caca#k(Nivel 1 ~ 30)\r\n#bhablar|chatear|decir#k(Nivel 1 ~ 30)\r\n#bte amo, abrazo#k(Nivel 1 ~ 30)\r\n#bhuele mis pies, rockout, abucheo#k(Nivel 1 ~ 30)\r\n#btrickortreat#k (Nivel 1 ~ 30)\r\n#bmonstermash#k (Nivel 1 ~ 30)");
            } else if (selection == 24) {
                cm.sendNext("Estos son los comandos para#rPorcupine#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(Nivel 1 ~ 30)\r\n#bte amo|abrazo|buen chico#k(Nivel 1 ~ 30)\r\n#bhablar|chatear|decir#k(Nivel 1 ~ 30)\r\n#bcojín|dormir|tejer|caca#k(Nivel 1 ~ 30)\r\n#bpeine|playa#k(Nivel 10 ~ 30)\r\n#btreeninja#k (Nivel 20 ~ 30)\r\n#bdart#k (Nivel 20 ~ 30)");
            } else if (selection == 25) {
                cm.sendNext("Estos son los comandos para#rSnowman#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(Nivel 1 ~ 30)\r\n#bTe amo, mi amor, me gustas#k(Nivel 1 ~ 30)\r\n#bmerrychristmas#k (Nivel 1 ~ 30)\r\n#bchica, adorable, lindo, bonito#k(Nivel 1 ~ 30)\r\n#bpeine, playa/malo, no, chica mala, chico malo#k(Nivel 1 ~ 30)\r\n#bhablar, charlar, decir/dormir, tener sueño, ir a la cama#k(Nivel 10 ~ 30)\r\n#bchang#k (Nivel 20 ~ 30)");
            } else if (selection == 26) {
                cm.sendNext("Estos son los comandos para#rSkunk#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (Nivel 1 ~ 30)\r\n#bmalo/no/chica mala/chico malo#k(Nivel 1 ~ 30)\r\n#bdescansar, relajarse, hacer caca#k(Nivel 1 ~ 30)\r\n#bhablar/chatear/decir te amo#k(Nivel 1 ~ 30)\r\n#bacurrucarse/abrazarse, dormir, buen chico#k(Nivel 1 ~ 30)\r\n#bgordo, ciego, mal aliento#k(Nivel 10 ~ 30)\r\n#bvístete, trae el funk#k(Nivel 20 ~ 30)");
            } else if (selection == 27) {
                status = 14;
                cm.sendNext("Para transferir los puntos de habilidad, la cercanía y el nivel de la mascota, se requiere el desplazamiento de reinicio de AP de la mascota. Si llevas este \r\ndesplázate hasta Mar the Fairy en Ellinia, ella transferirá el nivel y la cercanía de la mascota a otra. Te lo doy especialmente porque puedo sentir tu corazón por tu mascota. Sin embargo, no puedo dar esto gratis. Puedo darte este libro por 250.000 mesos. ¡Oh, casi lo olvido! Incluso si tienes este libro, no sirve de nada si no tienes una nueva mascota para transferir los puntos de habilidad.");
            }
            if (selection > 2 && selection < 27) {
                cm.dispose();
            }
        } else if (status == 2) {
            if (sel == 0) {
                cm.sendNextPrev("Pero el Agua de la Vida solo sale un poco en la parte inferior del Árbol del Mundo, así que no puedo darle demasiado tiempo en la vida... Lo sé, es muy desafortunado... pero incluso si vuelve a convertirse en una muñeca siempre puedo devolverle la vida, así que sé bueno con ella mientras estés con ella.");
            } else if (sel == 1) {
                cm.sendNextPrev("Habla con la mascota, prestale atención y su nivel de intimidad aumentará y, eventualmente, su nivel general también aumentará. A medida que aumenta el nivel de intimidad, el nivel general de la mascota aumentará poco después. A medida que el nivel general aumenta, un día la mascota puede incluso hablar un poco como una persona, así que esfuérzate por criarla. Por supuesto que no será fácil hacerlo...");
            } else if (sel == 2) {
                cm.sendNextPrev("Después de un tiempo... eso es correcto, dejan de moverse. Simplemente vuelven a ser una muñeca, después de que el efecto de la magia disminuye y el Agua de la Vida se seca. Pero eso no significa que se detenga para siempre, porque una vez que viertes Agua de Vida, volverá a tener vida.");
            } else if (sel == 27) {
                cm.sendYesNo("Se descontarán 250.000 mesos. ¿Realmente quieres comprar?");
            }
        } else if (status == 3) {
            if (sel == 0) {
                cm.sendNextPrev("Oh, sí, reaccionarán cuando les des órdenes especiales. Puedes regañarlos, amarlos... todo\r\ndepende de cómo los cuides. Tienen miedo de dejar a sus amos, así que sé amable con ellos y muéstrales amor. Pueden ponerse tristes y solitarios rápidamente...");
            } else if (sel == 1) {
                cm.sendNextPrev("Puede que sea una muñeca viva, pero ellos también tienen vida, por lo que también pueden sentir el hambre. #bFullness#k muestra el nivel de hambre que tiene la mascota. 100 es el máximo, y cuanto más bajo sea, significa que la mascota tiene más hambre. Después de un tiempo, ni siquiera seguirá tus órdenes y estará a la ofensiva, así que ten cuidado con eso.");

            } else if (sel == 2) {
                cm.sendNextPrev("Incluso si algún día vuelve a moverse, es triste verlos detenerse por completo. Por favor, sea amable con ellos mientras estén vivos y en movimiento. Aliméntelos bien también. ¿No es agradable saber que hay algo vivo que te sigue y te escucha sólo a ti?");
            } else if (sel == 27) {
                if (cm.getMeso() < 250000 || !cm.canHold(4160011)) {
                    cm.sendOk("Verifique si su inventario tiene espacios vacíos o no tiene suficientes mesos.");
                } else {
                    cm.gainMeso(-250000);
                    cm.gainItem(4160011, 1);
                }
                cm.dispose();
            }
        } else if (status == 4) {
            if (sel != 1) {
                cm.dispose();
            }
            cm.sendNextPrev("¡Oh sí! Las mascotas no pueden comer la comida humana normal. En cambio mi discípulo#bDoofus#k vende#bComida para mascotas#ken el Henesys Market así que si necesitas comida para tu mascota, busca Henesys. Será una buena idea comprar la comida con antelación y alimentar a la mascota antes de que tenga mucha hambre.");
        } else if (status == 5) {
            cm.sendNextPrev("Ah, y si no alimentas a la mascota durante un largo período de tiempo, volverá sola a casa. Puedes sacarlo de su casa y alimentarlo pero no es realmente bueno para la salud de la mascota, así que intenta alimentarlo de forma regular para que no baje a ese nivel, ¿vale? Creo que esto servirá.");
        } else {
            cm.dispose();
        }
    }
}