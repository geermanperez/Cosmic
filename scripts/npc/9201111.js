/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMap().getId() == 610030500) {
        cm.sendOk("Estás a punto de mojarte y hacer lo que mejor hace un pirata: ¡cavar en busca de botín! Ten cuidado: el agua que hay debajo se conoce como agua pesada y es tan densa que dudo que puedas atravesarla nadando. Tendrás que abrirte camino... La reliquia que buscas se conoce como el Arma Prohibida, que es un arma antigua del mejor pirata que adorna las costas de Masteria: ¡Steel Fist Jack! Ha sido enterrado en uno de los muchos cofres del tesoro que encontrarás debajo del mar. No será fácil... Los piratas eran conocidos por enterrar cosas en los lugares más inverosímiles, así que profundiza y mantén la guardia alta. ¡Hay tiburones y cosas mucho peores en esas aguas!");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("Hace mucho tiempo, un extraño guerrero llegó a las costas de Masteria. Se afirma que es miembro de una misteriosa banda de guerreros que usaban armas con forma de garras y artillería basada en proyectiles para derrotar a los enemigos. Conocido como 'Steel Fist Jack', su astucia y engaño en la batalla eran endiabladamente efectivos. Finalmente construyó un barco y abandonó la Fortaleza en busca de su antigua tripulación y capitán.");
        cm.dispose();
    }
}