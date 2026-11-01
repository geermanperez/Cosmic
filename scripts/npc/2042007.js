/**
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Drago (MapleStorySA)
 2.0 - Second Version by Jayd - translated CPQ contents to English
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var rnk = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.sendOk("Muy bien, espero que podamos charlar más tarde la próxima vez.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getPlayer().getMapId() == 980030010) {
            if (status == 0) {
                cm.sendNext("¡Espero que te hayas divertido en el Monster Carnival!");
            } else if (status > 0) {
                cm.warp(980030000, 0);
                cm.dispose();
            }
        } else if (cm.getChar().getMap().isCPQLoserMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shiu = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shiu += "#rA#k";
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla a pesar de tu excelente desempeño. ¡La victoria puede ser tuya la próxima vez! \r\n\r\n#bYu resultado:" + shiu);
                        rnk = 10;
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shiu += "#rB#k";
                        rnk = 20;
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla, incluso con tu desempeño final. ¡Solo un poquito y la victoria podría haber sido tuya! \r\n\r\n#bYu resultado:" + shiu);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shiu += "#rC#k";
                        rnk = 30;
                        cm.sendOk("Desafortunadamente, o empataste o perdiste la batalla. La victoria es para los que se esfuerzan. Veo tus esfuerzos, por eso la victoria no está lejos de tu alcance. ¡Sigue así!\r\n\r\n#bTu resultado:" + shiu);
                    } else {
                        shiu += "#rD#k";
                        rnk = 40;
                        cm.sendOk("Desafortunadamente, empataste o perdiste la batalla, y tu desempeño se refleja claramente en ello. Espero más de ti la próxima vez. \r\n\r\n#bYu resultado:" + shiu);
                    }
                } else {
                    cm.warp(980030000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 10:
                        cm.warp(980030000, 0);
                        cm.gainExp(35000);
                        cm.dispose();
                        break;
                    case 20:
                        cm.warp(980030000, 0);
                        cm.gainExp(25000);
                        cm.dispose();
                        break;
                    case 30:
                        cm.warp(980030000, 0);
                        cm.gainExp(12500);
                        cm.dispose();
                        break;
                    case 40:
                        cm.warp(980030000, 0);
                        cm.gainExp(3500);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980030000, 0);
                        cm.dispose();
                        break;
                }
            }
        } else if (cm.getChar().getMap().isCPQWinnerMap()) {
            if (status == 0) {
                if (cm.getChar().getParty() != null) {
                    var shi = "";
                    if (cm.getPlayer().getFestivalPoints() >= 300) {
                        shi += "#rA#k";
                        rnk = 1;
                        cm.sendOk("Felicitaciones por tu victoria!!! ¡Qué actuación! ¡El grupo opuesto no pudo hacer nada! ¡Espero el mismo buen trabajo la próxima vez! \r\n\r\n#bYu resultado:" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 100) {
                        shi += "#rB#k";
                        rnk = 2;
                        cm.sendOk("¡Felicitaciones por tu victoria! ¡Eso fue increíble! ¡Hiciste un buen trabajo contra el grupo contrario! ¡Solo un poco más y definitivamente obtendrás una A la próxima vez! \r\n\r\n#bYu resultado:" + shi);
                    } else if (cm.getPlayer().getFestivalPoints() >= 50) {
                        shi += "#rC#k";
                        rnk = 3;
                        cm.sendOk("Felicitaciones por su victoria. Hiciste algunas cosas aquí y allá, pero eso no puede considerarse una buena victoria. Espero más de ti la próxima vez. \r\n\r\n#bYu resultado:" + shi);
                    } else {
                        shi += "#rD#k";
                        rnk = 4;
                        cm.sendOk("Felicitaciones por su victoria, aunque su desempeño no lo reflejó del todo. ¡Sé más activo en tu próxima participación en el Monster Carnival! \r\n\r\n#bYu resultado:" + shi);
                    }
                } else {
                    cm.warp(980030000, 0);
                    cm.dispose();
                }
            } else if (status == 1) {
                switch (rnk) {
                    case 1:
                        cm.warp(980030000, 0);
                        cm.gainExp(875000);
                        cm.dispose();
                        break;
                    case 2:
                        cm.warp(980030000, 0);
                        cm.gainExp(700000);
                        cm.dispose();
                        break;
                    case 3:
                        cm.warp(980030000, 0);
                        cm.gainExp(555000);
                        cm.dispose();
                        break;
                    case 4:
                        cm.warp(980030000, 0);
                        cm.gainExp(100000);
                        cm.dispose();
                        break;
                    default:
                        cm.warp(980030000, 0);
                        cm.dispose();
                        break;
                }
            }
        }
    }
}  