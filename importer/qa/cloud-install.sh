#!/usr/bin/env bash
set -euo pipefail
cd /workspace/bizphone-ai-answer
test -f importer/engine/package-lock.json
for kghq_tool in node npm git python3 chromium docker; do command -v "$kghq_tool" >/dev/null; done
python3 -c 'import PIL, numpy'
npm ci --prefix importer/engine --ignore-scripts --no-audit --no-fund --prefer-offline --fetch-retries=1 --fetch-timeout=30000
kghq_docker_cmd=(env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH docker --host=unix:///var/run/docker.sock)
"${kghq_docker_cmd[@]}" info --format '{{.ServerVersion}}'
if [ -n "${CODEX_PROXY_CERT:-}" ]; then
  "${kghq_docker_cmd[@]}" build --secret "id=proxy_ca,src=$CODEX_PROXY_CERT" -f importer/worker/Dockerfile -t kghq-converter-runner:0.5.0-rc1 importer
else
  "${kghq_docker_cmd[@]}" build -f importer/worker/Dockerfile -t kghq-converter-runner:0.5.0-rc1 importer
fi
python3 importer/qa/unit-checks.py
