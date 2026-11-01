var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    cm.sendOk("Espero que este viaje sea seguro y que podamos vivir allí en un lugar más tranquilo... Oye, cariño, vámonos.");
    cm.dispose();
}