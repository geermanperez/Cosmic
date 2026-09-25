/*
 * Jarvis - Asistente Multifunción y Servicios (EverleafMS / YunaMS)
 * ID de NPC: 9200000
 * Accesible mediante el botón Trade (MTS) y el comando @jarvis / @servicios
 */

var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;

    if (status == 0) {
        var msg = "           #e#b[ JARVIS - Asistente de EverleafMS ]#k#n\r\n";
        msg += "Hola #e#h ##n, soy tu asistente personal. ¿En qué puedo ayudarte hoy?\r\n\r\n";
        msg += "#L0##b[1] Abrir Almacén Universal (Storage de Cuenta)#k#l\r\n";
        msg += "#L1##b[2] Salón VIP de Estilos (Peinados, Caras y Piel)#k#l\r\n";
        msg += "#L2##b[3] Tienda General y Consumibles#k#l\r\n";
        msg += "#L3##b[4] Viajar a la Entrada del Free Market#k#l\r\n";
        msg += "#L4##b[5] Limpiar Estados y Destrabar (@dispose)#k#l\r\n";
        msg += "#L5##b[6] Información de Rates y Horario del Servidor#k#l\r\n";

        cm.sendSimple(msg);
    } else if (status == 1) {
        if (selection == 0) {
            // Abrir Almacén
            cm.dispose();
            cm.getPlayer().getStorage().sendStorage(cm.getClient(), 9030000);
        } else if (selection == 1) {
            // Salón de Estilos (KIN 9900000)
            cm.dispose();
            cm.openNpc(9900000);
        } else if (selection == 2) {
            // Tienda General de Pociones y Consumibles (1012000)
            cm.dispose();
            cm.openShopNPC(1012000);
        } else if (selection == 3) {
            // Viajar al Free Market
            if (cm.getPlayer().getMapId() == 910000000) {
                cm.sendOk("¡Ya te encuentras en el Free Market!");
                cm.dispose();
            } else {
                cm.warp(910000000, 0);
                cm.dispose();
            }
        } else if (selection == 4) {
            // Desbugear
            cm.enableActions();
            cm.sendOk("Tus acciones y estado han sido desbloqueados exitosamente.");
            cm.dispose();
        } else if (selection == 5) {
            // Rates e Información
            var world = cm.getClient().getWorld();
            var exp = cm.getClient().getWorldServer().getExpRate();
            var meso = cm.getClient().getWorldServer().getMesoRate();
            var drop = cm.getClient().getWorldServer().getDropRate();
            var quest = cm.getClient().getWorldServer().getQuestRate();
            
            var info = "           #e#b[ INFORMACIÓN DE EVERLEAFMS ]#k#n\r\n\r\n";
            info += "#eRates Actuales:#n\r\n";
            info += " • Experiencia (EXP): #b" + exp + "x#k\r\n";
            info += " • Mesos: #b" + meso + "x#k\r\n";
            info += " • Drops: #b" + drop + "x#k\r\n";
            info += " • Misiones: #b" + quest + "x#k\r\n\r\n";
            info += "Recuerda que puedes abrir este menú en cualquier mapa pulsando el botón #rTrade#k o escribiendo #b@jarvis#k.";
            
            cm.sendOk(info);
            cm.dispose();
        }
    }
}
