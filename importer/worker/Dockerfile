# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim
WORKDIR /opt/kghq
COPY engine/package.json engine/package-lock.json ./engine/
COPY --chmod=0755 engine/*.mjs ./engine/
COPY --chmod=0755 worker/runner.mjs ./worker/runner.mjs
# Debian package sources use HTTP signed package indexes. npm retains HTTPS verification.
# A public proxy CA, when needed, exists only in this build step's secret mount.
RUN --mount=type=secret,id=proxy_ca \
    apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates git \
    && rm -rf /var/lib/apt/lists/* \
    && cd /opt/kghq/engine \
    && NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm ci --ignore-scripts --no-audit --no-fund \
    && NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm install --global @oven/bun-linux-x64-baseline@1.3.11 --ignore-scripts --no-audit --no-fund \
    && ln -s /usr/local/lib/node_modules/@oven/bun-linux-x64-baseline/bin/bun /usr/local/bin/bun \
    && npm cache clean --force
ENV KGHQ_CHROMIUM=/usr/bin/chromium
USER node
