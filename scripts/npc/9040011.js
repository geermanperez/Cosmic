/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
function start() {
    cm.sendOk("<Aviso>\r\n¿Eres parte de un gremio que posee mucho coraje y confianza? ¡Entonces enfréntate a Guild Quest y desafíate a ti mismo!\r\n\r\n#bPara participar:#k\r\n1. ¡El gremio debe estar formado por al menos 6 personas!\r\n2. ¡El líder de Guild Quest debe ser un Maestro o un Maestro Jr. del Gremio!\r\n3. ¡La Guild Quest puede terminar antes de tiempo si el número de miembros del gremio que participan cae por debajo de 6, o si el líder decide finalizarla antes!");
    cm.dispose();
}