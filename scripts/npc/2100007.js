/* Author: aaroncsn <MapleSea Like, Incomplete, Needs skin id>
	NPC Name: 		Laila
	Map(s): 		The Burning Road: Ariant(2600000000)
	Description: 	Skin Care Specialist
*/

var status = 0;
var skin = Array(0, 1, 2, 3, 4);

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {  // disposing issue with stylishs found thanks to Vcoc
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendNext("Hohoh ~ bienvenido, bienvenido. Bienvenido a Ariant Skin Care. Has entrado en una reconocida tienda de cuidado de la piel que incluso la propia Reina frecuenta este lugar. si tienes#bCupón para el cuidado de la piel de Ariant#kcontigo, nosotros nos encargamos del resto. ¿Qué tal dejar actuar en tu piel hoy?");
        } else if (status == 1) {
            cm.sendStyle("Con nuestra máquina especializada, podrá verse usted mismo después del tratamiento con antelación. ¿Qué tipo de tratamiento para la piel te gustaría hacer? Elige el estilo de tu agrado...", skin);
        } else if (status == 2) {
            cm.dispose();
            if (cm.haveItem(5153007) == true) {
                cm.gainItem(5153007, -1);
                cm.setSkin(skin[selection]);
                cm.sendOk("¡Disfruta de tu piel nueva y mejorada!");
            } else {
                cm.sendNext("Hmmm... No creo que tengas nuestro cupón de cuidado de la piel contigo. Sin él no puedo darte el tratamiento.");
            }
        }
    }
}