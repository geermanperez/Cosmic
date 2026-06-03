package net.server.http;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import net.server.Server;
import net.server.channel.Channel;
import net.server.world.World;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class AdminHttpServer {
    private final HttpServer server;

    public AdminHttpServer(String host, int port, String adminToken) throws IOException {
        server = HttpServer.create(new InetSocketAddress(host, port), 0);
        server.createContext("/admin/online-players", new OnlinePlayersHandler(adminToken));
        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
    }

    public void start() {
        server.start();
        System.out.println("Admin HTTP server listening on " + server.getAddress());
    }

    public void stop(int delaySeconds) {
        server.stop(delaySeconds);
    }

    static class OnlinePlayersHandler implements HttpHandler {
        private final String adminToken;

        OnlinePlayersHandler(String adminToken) {
            this.adminToken = adminToken == null ? "" : adminToken;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            if (!adminToken.isBlank()) {
                String requestToken = exchange.getRequestHeaders().getFirst("X-Admin-Token");
                if (!adminToken.equals(requestToken)) {
                    sendJson(exchange, 403, "{\"ok\":false,\"message\":\"Forbidden\"}");
                    return;
                }
            }

            List<String> rows = new ArrayList<>();

            for (World w : Server.getInstance().getWorlds()) {
                for (Channel ch : w.getChannels()) {
                    try {
                        for (client.Character chr : ch.getPlayerStorage().getAllCharacters()) {
                            String name = chr.getName();
                            int id = chr.getId();
                            int worldId = chr.getWorld();
                            int channelId = chr.getClient() != null ? chr.getClient().getChannel() : ch.getId();
                            int map = chr.getMapId();
                            rows.add(String.format("{\"id\":%d,\"name\":\"%s\",\"world\":%d,\"channel\":%d,\"map\":%d}", id, escapeJson(name), worldId, channelId, map));
                        }
                    } catch (Throwable t) {
                        // defensive: ignore characters iteration problems
                    }
                }
            }

            String body = "{\"players\": [" + String.join(",", rows) + "]}";
            sendJson(exchange, 200, body);
        }

        private static void sendJson(HttpExchange exchange, int status, String body) throws IOException {
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(status, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }

        private static String escapeJson(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
        }
    }
}
