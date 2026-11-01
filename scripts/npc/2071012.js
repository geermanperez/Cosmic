/* A Familiar Lady
    Hidden Street : Gloomy Forest (922220000)
 */

var status;

function start() {
    status = -1;
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

        if (status == 0) {
            if (cm.getQuestProgressInt(23647, 1) != 0) {
                cm.dispose();
                return;
            }

            if (!cm.haveItem(4031793, 1)) {
                cm.sendOk("Umm... Oye... ¿Me ayudarías a encontrar un#bpelaje plateado suave y brillante#kque perdí en el bosque? ¡Lo necesito, lo necesito, lo necesito muchísimo!");
                cm.dispose();
                return;
            }

            cm.sendYesNo("Oye... Umm... ¿Me ayudarías a encontrar un#bpelaje plateado suave y brillante#kque perdí en el bosque? ¡Lo necesito, lo necesito, lo necesito muchísimo! ... ¡¡¡Oh, lo encontraste !!! ¿Me lo darás?");
        } else if (status == 1) {
            cm.sendNext("Teehehee ~ Esa es tu recompensa por quitármelo, te sirve de mucho.");
            cm.gainItem(4031793, -1);
            cm.gainFame(-5);
            cm.setQuestProgress(23647, 1, 1);

            cm.dispose();
        }
    }
}