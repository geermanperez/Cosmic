/* Author: aaroncsn <MapleSea Like, Need to add creation of minigame>
	NPC Name: 		Wisp
	Map(s): 		Ludibrium: Eos Tower Entrance(220000400)
	Description: 		Pet Master
*/

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("Hola, soy#bmar el hada#kdel principal discípulo de la Isla Victoria. Mar el Hada me llamó aquí para ver si están cuidando a las mascotas aquí en Ludibrium. ¿Qué puedo hacer por ti?\r\n#L0##bMi mascota se ha vuelto a convertir en muñeca.\r\n¡Por favor ayúdame a hacer que se mueva nuevamente!#k#l \r\n#L1##bCuéntame más sobre mascotas.#k#l \r\n#L2##b¿Cómo crío mascotas?#k#l \r\n#L3##b¿Las mascotas también mueren?#k#l \r\n#L4##b¿Cuáles son los comandos para el gatito marrón y negro?#k#l \r\n#L5##b¿Cuáles son los comandos para el cachorro marrón?#k#l \r\n#L6##b¿Cuáles son los comandos para el conejito rosa y blanco?#k#l \r\n#L7##b¿Cuáles son los comandos para Mini Cargo?#k#l \r\n#L8##b¿Cuáles son los comandos para Husky?#k#l \r\n#L9##b¿Cuáles son los comandos de Black Pig?#k#l \r\n#L10##b¿Cuáles son los comandos para Panda?#k#l \r\n#L11##b¿Cuáles son los comandos para Dino Boy & Girl?#k#l \r\n#L12##b¿Cuáles son los comandos para Rudolph?#k#l \r\n#L13##b¿Cuáles son los comandos para Monkey?#k#l \r\n#L14##b¿Cuáles son los comandos para Robot?#k#l \r\n#L15##b¿Cuáles son los comandos para Elephant?#k#l \r\n#L16##b¿Cuáles son los comandos de Golden Pig?#k#l \r\n#L17##b¿Cuáles son los comandos de Penguin?#k#l \r\n#L18##b¿Cuáles son los comandos del Mini Yeti?#k#l \r\n#L19##b¿Cuáles son los comandos para Jr. Balrog?\r\n#L20##b¿Cuáles son los comandos para Baby Dragon?#k#l \r\n#L21##b¿Cuáles son los comandos para el Dragón Verde/Rojo/Azul?#k#l \r\n#L22##b¿Cuáles son los comandos para Black Dragon?#k#l \r\n#L23##b¿Cuáles son los comandos para Snowman?#k#l \r\n#L24##b¿Cuáles son los comandos para Sun Wu Kong?#k#l \r\n#L25##b¿Cuáles son los comandos para Jr. Reaper?#k#l \r\n#L26##b¿Cuáles son los comandos para Crystal Rudolph?#k#l \r\n#L27##b¿Cuáles son los comandos para Kino?#k#l \r\n#L28##b¿Cuáles son los comandos de White Duck?#k#l \r\n#L29##b¿Cuáles son los comandos para Pink Bean?#k#l \r\n#L30##b¿Cuáles son los comandos de Porcupine?#k#l");
        } else if (status == 1) {
            if (selection == 0) {
                cm.sendNext("Soy Wisp, continuando con los estudios que me asignó mi Maestra Mar el Hada. Parece que hay muchas mascotas, incluso ella, en Ludibrium. Necesito volver a mis estudios, así que si me disculpan...");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("Hmmmm, debes tener muchas preguntas sobre las mascotas. Hace mucho tiempo, una persona llamada #bCloy#k roció Agua de Vida sobre él y le lanzó un hechizo para crear un animal mágico. Sé que suena increíble, pero es una muñeca que se convirtió en un ser vivo real. Entienden y siguen muy bien a las personas.");
            } else if (selection == 2) {
                cm.sendNext("Dependiendo de la orden que le des, las mascotas pueden amarla, odiarla y mostrar otro tipo de reacciones. Si le das una orden a la mascota y te sigue bien, tu cercanía aumenta. Haga doble clic en la mascota y podrá comprobar la cercanía, nivel, plenitud, etc...");
            } else if (selection == 3) {
                cm.sendNext("Morir... bueno, técnicamente no están VIVOS per se, así que no sé si morir es el término correcto a utilizar. Son muñecos con mi poder mágico y el poder del Agua de Vida para convertirse en un objeto vivo. Por supuesto, mientras está vivo, es como un animal vivo...");
            } else if (selection == 4) {
                cm.sendNext("Estos son los comandos para#rGatito marrón y gatito negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1~30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 10 ~ 30)\r\n#bcutie#k (nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("Estos son los comandos para#rCachorro marrón#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#bestúpido, te odio, perro malo, tonto#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1~30)\r\n#bpee#k (nivel 10 ~ 30)\r\n#bhablar, decir, charlar, ladrar#k(nivel 10 ~ 30)\r\n#bdown#k (nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 6) {
                cm.sendNext("Estos son los comandos para#rConejito rosa y conejito blanco#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1~30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 10 ~ 30)\r\n#bhug#k (nivel 10 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 7) {
                cm.sendNext("Estos son los comandos para#rMini Cargo#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1~30)\r\n#bpee#k (nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 10 ~ 30)\r\n#bla mirada, el carisma#k(nivel 10 ~ 30)\r\n#bbuen chico, bien#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 8) {
                cm.sendNext("Estos son los comandos para#rHusky#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#bestúpido, te odio, perro malo, tonto#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1 ~ 30)\r\n#bpee#k (nivel 1 ~ 30)\r\n#bhablar, decir, charlar, ladrar#k(nivel 10 ~ 30)\r\n#bdown#k (nivel 10 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 9) {
                cm.sendNext("Estos son los comandos para#rcerdo negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1~30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bmano, arriba, pararse#k(nivel 1 ~ 30)\r\n#bhablar, decir, charlar, abrazar#k(nivel 10 ~ 30)\r\n#bsmile#k (nivel 10 ~ 30)\r\n#breír, sonreír#k(nivel 10 ~ 30)\r\n#bcarisma, dormir, soñoliento, gotobed#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 10) {
                cm.sendNext("Estos son los comandos para#rPanda#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1 ~ 30)\r\n#bpee#k(nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie, abrazar#k(nivel 1 ~ 30)\r\n#bhablar, charlar#k(nivel 10 ~ 30)\r\n#bplay#k (nivel 20 ~ 30)\r\n#bcasi, bla#k(nivel 10 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 11) {
                cm.sendNext("Estos son los comandos para#rNiño Dino y Niña Dino#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, estúpido, te odio, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#bte amo, tonto#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bhablar, chatear (nivel 10 ~ 30)\r\n#bsonríe, ríe#k(nivel 1 ~ 30)\r\n#bcutie#k (nivel 10 ~ 30)\r\n#bdormir, siesta, sueño#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 12) {
                cm.sendNext("Estos son los comandos para#rRudolph#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k(nivel 1 ~30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(nivel 1 ~ 30)\r\n#bfeliz navidad, feliz navidad#k(nivel 11 ~ 30)\r\n#biloveyou#k(nivel 1 ~ 30)\r\n#bpoop#k(nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 11 ~ 30)\r\n#bsolitario, solo, abajo, nariz roja#k(nivel 11 ~ 30),\r\n#bcutie#k(nivel 11 ~ 30)\r\n#bpapilla, vete#k(nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 13) {
                cm.sendNext("Estos son los comandos para#rMonkey#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsentarse, descansar#k(nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#blevantarse, ponerse de pie#k(nivel 1 ~ 30)\r\n#bte amo, orinar#k(nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 11 ~ 30)\r\n#bjugar, aullar#k(nivel 11 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 14) {
                cm.sendNext("Estos son los comandos para#rRobot#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsentarse, pararse, levantarse#k(nivel 1 ~ 30)\r\n#bataque, malo, no, chico malo#k(nivel 1 ~ 30)\r\n#bestúpido, te odio, tonto#k(nivel 1 ~ 30)\r\n#bte amo, bien#k(nivel 1 ~ 30)\r\n#bhablar, disfrazarse#k(nivel 11 ~ 30)");
                cm.dispose();
            } else if (selection == 15) {
                cm.sendNext("Estos son los comandos para#rElephant#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsentarse, descansar#k(nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(nivel 1 ~ 30)\r\n#bte amo, orinar#k(nivel 1 ~ 30)\r\n#bhablar, decir, charlar, jugar#k(nivel 11 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 16) {
                cm.sendNext("Estos son los comandos para#rcerdo dorado#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#bcaca, te amo#k(nivel 1 ~ 30)\r\n#bhablar, decir, charlar#k(nivel 11 ~ 30)\r\n#bÁmame, abrázame#k(nivel 11 ~ 30)\r\n#bdormir, soñoliento, gotobed#k(nivel 21 ~ 30)\r\n#bimpresionado, fuera de aquí#k(nivel 21 ~ 30)\r\n#brodar, mostrarme el dinero#k(nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 17) {
                cm.sendNext("Estos son los comandos para#rPenguin#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#blevantarse, levantarse, levantarse#k(nivel 1 ~ 30)\r\n#biloveyou#k (nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(nivel 10 ~ 30)\r\n#babrazo, abrázame#k(nivel 10 ~ 30)\r\n#bala, mano#k(nivel 10 ~ 30)\r\n#bsleep#k (nivel 20 ~ 30)\r\n#bbeso, beso, beso#k(nivel 20 ~ 30)\r\n#bfly#k (nivel 20 ~ 30)\r\n#blindo, adorable#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 18) {
                cm.sendNext("Estos son los comandos para#rmini yeti#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo, no, chico malo, chica mala#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bbailar, boogie, shakeit#k(nivel 1 ~ 30)\r\n#blindo, chica, bonito, adorable#k(nivel 1 ~ 30)\r\n#bte amo, me gustas, mi amor#k(nivel 1 ~ 30)\r\n#bhablar, charlar, decir#k(nivel 10 ~ 30)\r\n#bdormir, siesta#k(nivel 10 ~ 30)");
                cm.dispose();
            } else if (selection == 19) {
                cm.sendNext("Estos son los comandos para#rJr. Balrog#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bliedown#k (nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bte amo|mi amor|me gustas#k(nivel 1 ~ 30)\r\n#blindo|lindo|bonito|adorable#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bsonrisa|torcida|risa#k(nivel 1 ~ 30)\r\n#bmelong#k (nivel 11 ~ 30)\r\n#bbueno|la mirada|carisma#k(nivel 11 ~ 30)\r\n#bhablar|hablar|chatear|decir#k(nivel 11 ~ 30)\r\n#bdormir|siesta|somnoliento#k(nivel 11 ~ 30)\r\n#bgas#k (nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 20) {
                cm.sendNext("Estos son los comandos para#rDragón bebé#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bte amo|te amo#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bestúpido|te odio|tonto#k(nivel 1 ~ 30)\r\n#bcutie#k (nivel 11 ~ 30)\r\n#bhablar|chatear|decir#k(nivel 11 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(nivel 11 ~ 30)");
                cm.dispose();
            } else if (selection == 21) {
                cm.sendNext("Estos son los comandos para#rDragón verde/rojo/azul#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 15 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 15 ~ 30)\r\n#bte amo|te amo#k(nivel 15 ~ 30)\r\n#bpoop#k (nivel 15 ~ 30)\r\n#bestúpido|te odio|tonto#k(nivel 15 ~ 30)\r\n#bhablar|chatear|decir#k(nivel 15 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(nivel 15 ~ 30)\r\n#bchange#k (nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 22) {
                cm.sendNext("Estos son los comandos para#rDragón Negro#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 15 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 15 ~ 30)\r\n#bte amo|te amo#k(nivel 15 ~ 30)\r\n#bpoop#k (nivel 15 ~ 30)\r\n#bestúpido|te odio|tonto#k(nivel 15 ~ 30)\r\n#bhablar|chatear|decir#k(nivel 15 ~ 30)\r\n#bdormir|somnoliento|gotobed#k(nivel 15 ~ 30)\r\n#bchica, cambio#k(nivel 21 ~ 30)");
                cm.dispose();
            } else if (selection == 23) {
                cm.sendNext("Estos son los comandos para#rSnowman#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bestúpido, te odio, tonto#k(nivel 1 ~ 30)\r\n#bTe amo, mi amor, me gustas#k(nivel 1 ~ 30)\r\n#bmerrychristmas#k (nivel 1 ~ 30)\r\n#bchica, adorable, lindo, bonito#k(nivel 1 ~ 30)\r\n#bmalo, no, chica mala, chico malo#k(nivel 1 ~ 30)\r\n#bhablar, charlar, decir/dormir, tener sueño, ir a la cama#k(nivel 10 ~ 30)\r\n#bchang#k (nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 24) {
                cm.sendNext("Estos son los comandos para#rSun Wu Kong#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k(nivel 1 ~ 30)\r\n#bno,malo,chica mala,chico malo#k(nivel 1 ~ 30)\r\n#bpoope#k(nivel 1 ~ 30)\r\n#bchica, adorable, linda, bonita#k(nivel 1 ~ 30)\r\n#bTe amo, te amo, te amo, me gustas, mi amor#k(nivel 1 ~ 30)\r\n#bhablar, charlar, decir/dormir, tener sueño, ir a la cama#k(nivel 10 ~ 30)\r\n#btransform#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 25) {
                cm.sendNext("Estos son los comandos para#rSegador Jr.#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bhacerse el muerto, caca#k(nivel 1 ~ 30)\r\n#bhablar|chatear|decir#k(nivel 1 ~ 30)\r\n#bte amo, abrazo#k(nivel 1 ~ 30)\r\n#bhuele mis pies, rockout, abucheo#k(nivel 1 ~ 30)\r\n#btrickortreat#k (nivel 1 ~ 30)\r\n#bmonstermash#k (nivel 1 ~ 30)");
                cm.dispose();
            } else if (selection == 26) {
                cm.sendNext("Estos son los comandos para#rcristal rodolfo#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bno|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bbla|broma#k(nivel 1 ~ 30)\r\n#bdisfrazar|transformar#k(nivel 1 ~ 30)\r\n#bimpresionante|sentirse bien|peor#k(nivel 1 ~ 30)\r\n#bte amo|hola nena#k(nivel 1 ~ 30)\r\n#bhablar|decir|chatear#k(nivel 10 ~ 30)\r\n#bdormir|somnoliento|siesta|gotobed#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 27) {
                cm.sendNext("Estos son los comandos para#rKino#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bmalo|no|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bpoop#k (nivel 1 ~ 30)\r\n#bdormir|siesta|somnoliento|gotobed#k(nivel 1 ~ 30)\r\n#bhablar|decir|chatear#k(nivel 10 ~ 30)\r\n#bte amo|mi amor|me gustas#k(nivel 10 ~ 30)\r\n#bcasi#k(nivel 10 ~ 30)\r\n#bdisfrazar|cambiar|transformar#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 28) {
                cm.sendNext("Estos son los comandos para#rpato blanco#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k(nivel 1 ~ 30)\r\n#bmalo|no|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#blevantarse|ponerse de pie#k(nivel 1 ~ 30)\r\n#bpoop#k(nivel 1 ~ 30)\r\n#bhablar|chatear|decir#k(nivel 1 ~ 30)\r\n#bhug#k(nivel 1 ~ 30)\r\n#bloveyou#k(nivel 1 ~ 30)\r\n#bcutie#k(nivel 1 ~ 30)\r\n#bsleep#k(nivel 1 ~ 30)\r\n#bsabelotodo (nivel 10 ~ 30)\r\n#bdance#k (nivel 20 ~ 30)\r\n#bswan#k(nivel 20 ~ 30)");
                cm.dispose();
            } else if (selection == 29) {
                cm.sendNext("Estos son los comandos para#rfrijol rosado#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k(nivel 1 ~ 30)\r\n#bmalo|no|chica mala|chico malo|caca#k(nivel 1 ~ 30)\r\n#bperezoso|tonto|odio hablar|chatear|decir|mumbleiloveyou|abrázame|loveyou|#k(nivel 1 ~ 30)\r\n#bagitar|música|charmbleh|broma|boo#k(nivel 20 ~ 30)\r\n#bgotobed|dormir|sleepypoke|apestoso|tonto|te odio#k(nivel 20 ~ 30)\r\n#bkongkong#k(nivel 30)");
                cm.dispose();
            } else if (selection == 30) {
                cm.sendNext("Estos son los comandos para#rPorcupine#k. El nivel mencionado al lado del comando muestra el nivel de mascota requerido para que responda.\r\n#bsit#k (nivel 1 ~ 30)\r\n#bno|malo|chica mala|chico malo#k(nivel 1 ~ 30)\r\n#bcojín para abrazar|dormir|tejer|caca#k(nivel 1 ~ 30)\r\n#bpeine|playa#k(nivel 10 ~ 30)\r\n#btreeninja|dardo#k(nivel 20 ~ 30)");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("Pero el Agua de la Vida solo sale un poco en el fondo del Árbol del Mundo, por lo que esos bebés no pueden estar vivos para siempre... Lo sé, es muy desafortunado... pero incluso si vuelve a convertirse en un muñeco, pueden volver a la vida, así que sé bueno con él mientras estés con él.");
        } else if (status == 3) {
            cm.sendNextPrev("Oh, sí, reaccionarán cuando les des órdenes especiales. Puedes regañarlos, amarlos… todo depende de cómo los cuides. Tienen miedo de dejar a sus amos, así que sé amable con ellos y muéstrales amor. Pueden ponerse tristes y solitarios rápidamente.");
            cm.dispose();
        } else if (status == 4) {
            cm.sendNextPrev("Habla con la mascota, prestale atención y su nivel de cercanía aumentará y eventualmente su nivel general también aumentará. A medida que aumenta la cercanía, el nivel general de la mascota aumentará poco después. A medida que el nivel general aumenta, un día la mascota puede incluso hablar un poco como una persona, así que esfuérzate por criarla. Por supuesto que no será fácil hacerlo...");
        } else if (status == 5) {
            cm.sendNextPrev("Puede que sea una muñeca viva, pero ellos también tienen vida, por lo que también pueden sentir el hambre. #bFullness#k muestra el nivel de hambre que tiene la mascota. 100 es el máximo, y cuanto más bajo sea, significa que la mascota tiene más hambre. Después de un tiempo, ni siquiera seguirá tus órdenes y estará a la ofensiva, así que ten cuidado con eso.");
        } else if (status == 6) {
            cm.sendNextPrev("¡Así es! Las mascotas no pueden comer la comida humana normal. En cambio, un osito de peluche en Ludibrium llamado#bPatricia#k vende#bComida para mascotas#kasí que si necesitas alimento para tu mascota, busca#bPatricia#k Será una buena idea comprar la comida con antelación y alimentar a la mascota antes de que tenga mucha hambre.");
        } else if (status == 7) {
            cm.sendNextPrev("Ah, y si no alimentas a la mascota durante un largo período de tiempo, volverá sola a casa. Puedes sacarlo de su casa y alimentarlo pero no es realmente bueno para la salud de la mascota, así que intenta alimentarlo de forma regular para que no baje a ese nivel, ¿vale? Creo que esto servirá.");
            cm.dispose();
        } else if (status == 8) {
            cm.sendNextPrev("Después de un tiempo... eso es correcto, dejan de moverse. Simplemente vuelven a ser una muñeca, después de que el efecto de la magia disminuye y el Agua de la Vida se seca. Pero eso no significa que se detenga para siempre, porque una vez que viertes Agua de Vida, volverá a tener vida.");
        } else if (status == 9) {
            cm.sendNextPrev("Incluso si algún día vuelve a moverse, es triste verlos detenerse por completo. Por favor, sea amable con ellos mientras estén vivos y en movimiento. Aliméntelos bien también. ¿No es agradable saber que hay algo vivo que te sigue y te escucha sólo a ti?");
            cm.dispose();
        }
    }
}