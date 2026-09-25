package client.command.commands.gm4;

import client.Character;
import client.Client;
import client.command.Command;
import net.server.dummy.DummyBotManager;

import java.util.Map;

public class BotCommand extends Command {
    {
        setDescription("Manage simulated AFK dummy player bots: !bot <spawn/remove/rotate/list>");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        if (params.length < 1) {
            player.yellowMessage("Sintaxis: !bot <spawn/chair/remove/rotate/list>");
            player.dropMessage(6, "  !bot spawn <personaje> [id_silla] - Spawnea un bot AFK en tu posicion");
            player.dropMessage(6, "  !bot chair <personaje> <id_silla> - Cambia la silla del bot (0 = parado)");
            player.dropMessage(6, "  !bot remove <personaje>           - Despawnea y elimina el bot");
            player.dropMessage(6, "  !bot rotate                      - Fuerza la rotacion de pueblos ahora");
            player.dropMessage(6, "  !bot list                        - Lista los bots AFK activos");
            return;
        }

        String sub = params[0].toLowerCase();
        DummyBotManager botManager = DummyBotManager.getInstance();

        switch (sub) {
            case "spawn": {
                if (params.length < 2) {
                    player.yellowMessage("Uso: !bot spawn <nombre_personaje> [id_silla]");
                    return;
                }
                String targetName = params[1];
                Integer charId = botManager.findCharacterIdByName(targetName);
                if (charId == null) {
                    player.dropMessage(5, "Error: El personaje '" + targetName + "' no existe en la base de datos.");
                    return;
                }

                int chairId = 0;
                if (params.length >= 3) {
                    try {
                        chairId = Integer.parseInt(params[2]);
                    } catch (NumberFormatException e) {
                        player.dropMessage(5, "ID de silla invalido, usando 0 (parado).");
                    }
                } else if (player.getChair() > 0) {
                    chairId = player.getChair();
                }

                boolean success = botManager.spawnBot(
                        charId,
                        targetName,
                        chairId,
                        player.getWorld(),
                        c.getChannel(),
                        player.getMapId(),
                        player.getPosition(),
                        true
                );

                if (success) {
                    player.dropMessage(6, "Bot AFK '" + targetName + "' desplegado exitosamente en tu ubicacion.");
                } else {
                    player.dropMessage(5, "No se pudo desplegar el bot AFK.");
                }
                break;
            }

            case "chair":
            case "silla": {
                if (params.length < 3) {
                    player.yellowMessage("Uso: !bot chair <nombre_personaje> <id_silla>");
                    player.dropMessage(6, "  Usa id_silla 0 para dejarlo parado.");
                    return;
                }
                String targetName = params[1];
                Integer charId = botManager.findCharacterIdByName(targetName);
                if (charId == null) {
                    player.dropMessage(5, "Personaje '" + targetName + "' no encontrado.");
                    return;
                }
                int chairId;
                try {
                    chairId = Integer.parseInt(params[2]);
                } catch (NumberFormatException e) {
                    player.dropMessage(5, "ID de silla invalido.");
                    return;
                }
                boolean updated = botManager.setBotChair(charId, chairId);
                if (updated) {
                    player.dropMessage(6, "Silla del bot '" + targetName + "' actualizada a: " + (chairId > 0 ? chairId : "Ninguna (parado)"));
                } else {
                    player.dropMessage(5, "El bot '" + targetName + "' no esta activo en este momento.");
                }
                break;
            }

            case "remove": {
                if (params.length < 2) {
                    player.yellowMessage("Uso: !bot remove <nombre_personaje>");
                    return;
                }
                String targetName = params[1];
                Integer charId = botManager.findCharacterIdByName(targetName);
                if (charId == null) {
                    player.dropMessage(5, "Personaje '" + targetName + "' no encontrado.");
                    return;
                }
                boolean removed = botManager.removeBot(charId);
                if (removed) {
                    player.dropMessage(6, "Bot AFK '" + targetName + "' eliminado correctamente.");
                } else {
                    player.dropMessage(5, "No se encontro un bot registrado con ese nombre.");
                }
                break;
            }

            case "rotate": {
                botManager.rotateBots();
                player.dropMessage(6, "Se ha forzado la rotacion de todos los bots AFK entre los pueblos.");
                break;
            }

            case "list": {
                Map<Integer, Character> bots = botManager.getActiveBots();
                if (bots.isEmpty()) {
                    player.dropMessage(5, "No hay bots AFK activos en este momento.");
                    return;
                }
                player.yellowMessage("=== Bots AFK Activos (" + bots.size() + ") ===");
                for (Character bot : bots.values()) {
                    String mapName = (bot.getMap() != null) ? bot.getMap().getMapName() : "Desconocido";
                    int mapId = bot.getMapId();
                    int chair = bot.getChair();
                    player.dropMessage(6, "- " + bot.getName() + " (ID: " + bot.getId() + ") -> Mapa: " + mapName + " (" + mapId + ") | Silla: " + (chair > 0 ? chair : "Ninguna"));
                }
                break;
            }

            default:
                player.yellowMessage("Comando desconocido. Usa: !bot <spawn/remove/rotate/list>");
                break;
        }
    }
}
