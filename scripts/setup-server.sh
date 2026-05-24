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

echo "==> Generating Strapi .env..."
if [ ! -f strapi/.env ]; then
  cat > strapi/.env <<EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF
  echo "  -> Generated strapi/.env with random keys"
fi

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
