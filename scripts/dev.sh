#!/usr/bin/env bash
# Frees the dev ports and (re)starts the local stack.
#
#   scripts/dev.sh            free ports 3000 (client), 8000 (api), 6006 (storybook), then docker compose up
#   scripts/dev.sh --down     only free the ports; don't start anything
#   PORTS="3000 8000" scripts/dev.sh    override the port list
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORTS=(${PORTS:-3000 8000 6006})
START=1
[[ "${1:-}" == "--down" ]] && START=0

listeners() { lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | sort -u || true; }
describe()  { ps -o pid=,comm= -p "$1" 2>/dev/null | sed 's/^ *//'; }

# Compose publishes ports through Docker's own process; stop the stack rather than kill that.
echo "Stopping compose stack…"
docker compose -f "$ROOT/docker-compose.yml" down --remove-orphans >/dev/null 2>&1 || true

for port in "${PORTS[@]}"; do
  pids=$(listeners "$port")
  if [[ -z "$pids" ]]; then
    echo "port $port: free"
    continue
  fi
  for pid in $pids; do
    [[ "$pid" == "$$" ]] && continue
    desc=$(describe "$pid")
    case "$desc" in
      *com.docker*|*Docker*) echo "port $port: held by Docker ($desc); stop that container yourself"; continue ;;
    esac
    echo "port $port: killing $desc"
    kill "$pid" 2>/dev/null || true
  done
  # Give processes a moment to exit, then force anything still holding the port.
  for _ in 1 2 3 4 5; do [[ -z "$(listeners "$port")" ]] && break; sleep 0.5; done
  for pid in $(listeners "$port"); do
    [[ "$pid" == "$$" ]] && continue
    echo "port $port: force-killing $(describe "$pid")"
    kill -9 "$pid" 2>/dev/null || true
  done
done

[[ $START -eq 0 ]] && { echo "Ports freed."; exit 0; }

echo "Starting compose stack…"
docker compose -f "$ROOT/docker-compose.yml" up -d --build

echo -n "Waiting for the client"
for _ in $(seq 1 120); do
  if curl -sf -o /dev/null http://localhost:3000/ 2>/dev/null; then echo; break; fi
  echo -n "."; sleep 2
done

echo "api:        $(curl -s http://localhost:8000/health || echo 'not responding')"
echo "dashboard:  http://localhost:3000"
echo "api docs:   http://localhost:8000/docs"
