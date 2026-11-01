var status = -1;

function start(mode, type, selection) {
    status++;
    if (status == 0) {
        qm.sendNext("¡Ey! ¿Puedes hacerme un favor? #p20000# parece un poco extraño estos días...");
    } else if (status == 1) {
        qm.sendNext("Solía ​​fruncir el ceño y quejarse de su artritis hasta hace poco, ¡pero de repente se volvió feliz y sonriente!");
    } else if (status == 2) {
        qm.sendNext("Tengo la sensación de que hay un secreto detrás de esa caja de madera. ¿Podrías mirar sigilosamente dentro de la caja de madera al lado de #p20000#?");
    } else if (status == 3) {
        qm.sendNext("Sabes dónde está #p20000#, ¿verdad? Él está a la derecha. Continúa hasta que veas dónde está Vikin, luego pasa por el tiburón y el pulpo que cuelgan y verás a John. La caja debería estar justo al lado de él.");
    } else if (status == 4) {
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.forceCompleteQuest();
    qm.gainExp(200);
    qm.dispose();
}