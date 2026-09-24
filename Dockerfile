# syntax=docker/dockerfile:1
# Initial Docker support thanks to xinyifly
# Optimisation performed by wejrox

#
# Cosmic JAR creation stage
#
FROM maven:3.9.6-amazoncorretto-21 AS jar

# Build in a separated location which won't have permissions issues.
WORKDIR /opt/cosmic

# Any changes to the pom will affect the entire build, so it should be copied first.
COPY pom.xml ./pom.xml

# Reuse downloaded dependencies and plugins when source changes invalidate this layer.
# BuildKit retains this cache on the builder; sharing=locked protects concurrent builds.
# Keep normal package resolution instead of the incompatible dependency:go-offline goal.
COPY src ./src
RUN --mount=type=cache,id=cosmic-maven-repository,target=/root/.m2/repository,sharing=locked mvn -B -ntp -f ./pom.xml clean package -Dmaven.test.skip -T 1C

#
# Server creation stage
#
FROM amazoncorretto:21

# Host the server in a location that won't have permissions issues.
WORKDIR /opt/server
# Copy the wizet files first since they're so big and won't change often.
COPY wz ./wz
# Copy the JAR we build earlier.
COPY --from=jar /opt/cosmic/target/Cosmic.jar ./Server.jar
# Scripts are sourced on server startup, so you can mount over them for quicker redeploy.
COPY scripts ./scripts/
# Config is read on server startup. EasyPanel mounts the repository version as config.base.yaml.
COPY config.yaml ./config.base.yaml
# Everlaf startup wrapper waits until the protected one-time reset is complete,
# then creates the runtime config with the Everlaf identity/rates.
COPY everlaf-start.sh ./everlaf-start.sh
RUN chmod +x ./everlaf-start.sh
# Default exposure, although not required if using docker compose.
# This exposes the login server, and channels.
# Format for channels: WWCC, where WW is 75 plus the world number and CC is 75 plus the channel number (both zero indexed).
EXPOSE 8484 7575 7576 7577 7578 7579 7580
ENTRYPOINT ["./everlaf-start.sh"]
