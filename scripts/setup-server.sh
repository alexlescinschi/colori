#!/usr/bin/env bash
set -euo pipefail

VPS_IP="${1:-VPS_IP}"

echo "==> Installing Docker..."
apt-get update -qq
apt-get install -y -qq ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Cloning repository..."
if [ ! -d ~/colori-md ]; then
  git clone https://github.com/alexlescinschi/colori.git ~/colori-md
fi
cd ~/colori-md

echo "==> Replacing VPS_IP placeholder..."
sed -i "s/VPS_IP/$VPS_IP/g" docker-compose.yml

echo "==> Starting services..."
docker compose up -d --build

echo ""
echo "============================================"
echo "  Setup complete!"
echo "  Site:   http://$VPS_IP:3000"
echo "  Admin:  http://$VPS_IP:1337/admin"
echo "  API:    http://$VPS_IP:1337/api"
echo "============================================"
