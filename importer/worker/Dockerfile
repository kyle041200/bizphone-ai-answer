# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim
WORKDIR /opt/kghq
COPY engine/package.json engine/package-lock.json ./engine/
COPY engine/*.mjs ./engine/
COPY worker/runner.mjs ./worker/runner.mjs
# Debian package sources use HTTP signed package indexes. npm retains HTTPS verification.
# A public proxy CA, when needed, exists only in this build step's secret mount.
RUN --mount=type=secret,id=proxy_ca \
    apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates git \
    && rm -rf /var/lib/apt/lists/* \
    && cd /opt/kghq/engine \
    && NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm ci --ignore-scripts --no-audit --no-fund \
    && npm cache clean --force
ENV KGHQ_CHROMIUM=/usr/bin/chromium
USER node
