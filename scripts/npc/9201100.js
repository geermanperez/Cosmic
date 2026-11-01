/**
 *9201100 - Taggrin
 *@author Ronan
 */

function start() {
    if (cm.getQuestStatus(8224) == 2) {
        cm.sendOk("Bien conocido, compañero del clan. Si necesita algo en lo que podamos ser de ayuda, intente hablar con uno de nuestros miembros.");
    } else {
        cm.sendOk("Hola, extraño. Somos el renombrado clan de mercenarios Raven Claw y yo soy su líder.");
    }

    cm.dispose();
}
