/*
	NPC Name: 		Insiginificant Being
	Map(s): 		Dungeon : Another Entrance
	Description: 		Takes you to another Dimension
*/

function start() {
    if (cm.getQuestStatus(6107) == 1 || cm.getQuestStatus(6108) == 1) {
        var ret = checkJob();
        if (ret == -1) {
            cm.sendOk("Por favor, forma un grupo y habla conmigo de nuevo.");
        } else if (ret == 0) {
            cm.sendOk("Asegúrate de que tu grupo sea del tamaño de 2.");
        } else if (ret == 1) {
            cm.sendOk("El trabajo de uno de los miembros de tu grupo no es elegible para ingresar al otro mundo.");
        } else if (ret == 2) {
            cm.sendOk("Uno de los miembros del nivel de tu grupo no es elegible para ingresar al otro mundo.");
        } else {
            var em = cm.getEventManager("s4aWorld");
            if (em == null) {
                cm.sendOk("No se le permite ingresar sin motivo desconocido. Intentar otra vez.");
            } else if (em.getProperty("started") === "true") {
                cm.sendOk("Alguien más ya está intentando derrotar al Jr.Balrog en otro mundo.");
            } else {
                var eli = em.getEligibleParty(cm.getParty());
                if (eli.size() > 0) {
                    if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                        cm.sendOk("En este caso ya hay un partido a su nombre registrado.");
                    }
                } else {
                    cm.sendOk("No puedes comenzar esta misión de grupo todavía porque tu grupo no está dentro del rango de tamaño, algunos de los miembros de tu grupo no son elegibles para intentarla o no están en este mapa. Si tienes problemas para encontrar miembros del grupo, prueba Party Search.");
                }
            }
        }
    } else {
        cm.sendOk("No se te permite entrar al otro mundo sin motivo desconocido.");
    }

    cm.dispose();
}

function action(mode, type, selection) {
}

function checkJob() {
    var party = cm.getParty();

    if (party == null) {
        return -1;
    }
    //    if (party.getMembers().size() != 2) {
    //	return 0;
    //    }
    var it = party.getMembers().iterator();

    while (it.hasNext()) {
        var cPlayer = it.next();

        if (cPlayer.getJobId() == 312 || cPlayer.getJobId() == 322 || cPlayer.getJobId() == 900) {
            if (cPlayer.getLevel() < 120) {
                return 2;
            }
        } else {
            return 1;
        }
    }
    return 3;
}