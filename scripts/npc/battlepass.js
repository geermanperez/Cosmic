/*
    Battle Pass / Daily Login Rewards System (30 Days Limit)
    Maple Administrator (9010000)
    YunaMS / EverleafMS
*/

var status = -1;
var day = 1;
var streak = 1;
var canClaim = false;
var completed = false;
var reward = null;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        day = cm.getBattlePassDay();
        streak = cm.getBattlePassStreak();
        canClaim = cm.canClaimBattlePass();
        completed = cm.isBattlePassCompleted();
        reward = cm.getBattlePassReward(day);

        var text = "#e#b[Pase de Batalla Diario]#k#n\r\n";
        text += "¡Hola, #h #! Bienvenido al sistema de recompensas diarias.\r\n\r\n";

        if (completed) {
            text += "🏆 #e#g¡Pase de Batalla Completado al 100%!#k#n\r\n";
            text += "Has completado exitosamente los #e30 días#n del pase y has reclamado todas las recompensas.\r\n";
            text += "¡El pase ha finalizado! Muchas gracias por tu gran lealtad y dedicación en el servidor.\r\n\r\n";
            text += "🔥 #eRacha final alcanzada:#n #r" + streak + " días consecutivos#k\r\n\r\n";
            text += "¿Qué deseas hacer?#b\r\n";
            text += "#L1#📋 Ver calendario de recompensas (Día 1 al 30)#l\r\n";
            text += "#L2#❓ Información sobre el Pase#l\r\n";
            text += "#L3#❌ Cerrar#l";
        } else {
            text += "📅 #eProgreso del Pase:#n Día #b" + day + "#k de 30\r\n";
            text += "🔥 #eRacha actual:#n #r" + streak + " día(s) consecutivos#k\r\n";
            text += "🎁 #eEstado de hoy:#n " + (canClaim ? "#g#e¡Recompensa lista para reclamar!#k#n" : "#rYa has reclamado hoy. ¡Vuelve mañana!#k") + "\r\n\r\n";
            
            var rewardTitle = reward != null ? reward.title() : "Recompensa Diaria";
            var rewardNx = reward != null ? reward.nx() : 0;
            var rewardMesos = reward != null ? reward.mesos() : 0;

            text += "#eRecompensa del Día " + day + ":#n\r\n";
            text += " - #b" + rewardTitle + "#k\r\n";
            if (rewardNx > 0) {
                text += " - #r+" + cm.numberWithCommas(rewardNx) + " NX Cash#k\r\n";
            }
            if (rewardMesos > 0) {
                text += " - #d+" + cm.numberWithCommas(rewardMesos) + " Mesos#k\r\n";
            }
            text += "\r\n¿Qué deseas hacer?#b\r\n";

            if (canClaim) {
                text += "#L0#⭐ ¡Reclamar mi recompensa de hoy!#l\r\n";
            }
            text += "#L1#📋 Ver calendario de recompensas (Día 1 al 30)#l\r\n";
            text += "#L2#❓ ¿Cómo funciona el Pase de Batalla?#l\r\n";
            text += "#L3#❌ Cerrar#l";
        }

        cm.sendSimple(text);
    } else if (status == 1) {
        if (selection == 0) {
            var claimResult = cm.claimBattlePass();
            if (claimResult == 0) {
                if (day == 30) {
                    cm.sendOk("🏆 #b#e¡INCREÍBLE, #h #!#k#n\r\n\r\n¡Has reclamado la recompensa final del #eDía 30#n y has completado el Pase de Batalla!\r\nHas obtenido la recompensa final y el pase ha finalizado con éxito.\r\n¡Muchas felicidades y gracias por jugar en nuestro servidor!");
                } else {
                    cm.sendOk("#b#e¡Felicidades, #h #!#k#n\r\n\r\nHas reclamado exitosamente tu recompensa del #eDía " + day + "#n.\r\n¡Mantén tu racha de conexión diaria para desbloquear los premios mayores!");
                }
            } else if (claimResult == 1) {
                cm.sendOk("Ya has reclamado tu recompensa diaria el día de hoy.\r\nVuelve mañana (00:00 UTC) para el Día " + (day + 1) + ".");
            } else if (claimResult == 2) {
                cm.sendOk("#r#e[Espacio Insuficiente]#k#n\r\nTu inventario está lleno. Por favor libera al menos 2 espacios en tus pestañas de Use, Etc, Setup y Cash antes de reclamar.");
            } else if (claimResult == 3) {
                cm.sendOk("🏆 Ya has completado los 30 días de este Pase de Batalla. El pase ha finalizado. ¡Muchas gracias por tu participación!");
            } else {
                cm.sendOk("Ocurrió un error al entregar tu recompensa. Por favor inténtalo nuevamente más tarde.");
            }
            cm.dispose();
        } else if (selection == 1) {
            var calText = "#e#b[Calendario del Pase de Batalla - 30 Días]#k#n\r\n\r\n";
            for (var d = 1; d <= 30; d++) {
                var r = cm.getBattlePassReward(d);
                if (r != null) {
                    var isMilestone = (d == 7 || d == 14 || d == 21 || d == 28 || d == 30);
                    var prefix = isMilestone ? "#r★ Día " + d + ":#k " : "#bDía " + d + ":#k ";
                    calText += prefix + "#e" + r.title() + "#n";
                    if (r.nx() > 0) calText += " (" + cm.numberWithCommas(r.nx()) + " NX)";
                    calText += "\r\n";
                }
            }
            cm.sendPrev(calText);
        } else if (selection == 2) {
            var infoText = "#e#b[Información del Pase de Batalla]#k#n\r\n\r\n";
            infoText += "1. #eConexión Diaria:#n Cada día que inicies sesión podrás reclamar tu recompensa del día correspondiente (hasta el Día 30).\r\n";
            infoText += "2. #eDuración Máxima:#n Al reclamar la recompensa del #eDía 30#n, el pase se completa definitivamente y finaliza.\r\n";
            infoText += "3. #eReinicio:#n El reclamo diario se habilita cada día a las #b00:00 UTC#k.\r\n";
            infoText += "4. #eHitos Semanales:#n Cada 7 días recibirás recompensas exclusivas (#rWhite Scrolls, Chaos Scrolls, NX Cash#k y la recompensa final del Día 30).\r\n";
            infoText += "5. #eAcceso Rápido:#n Puedes abrir este menú en cualquier momento escribiendo #b@battlepass#k, #b@pase#k o hablando con #bMaple Administrator#k en cualquier ciudad.\r\n";
            cm.sendPrev(infoText);
        } else {
            cm.dispose();
        }
    } else if (status == 2) {
        status = -1;
        action(1, 0, 0);
    }
}
