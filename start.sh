#!/bin/bash

# 포트 사용 중인 프로세스 종료
kill_port() {
  local port=$1
  local pid
  pid=$(lsof -ti :"$port" 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "포트 $port 사용 중인 프로세스(PID: $pid) 종료 중..."
    kill -9 $pid 2>/dev/null
    sleep 1
  fi
}

kill_port 8080
kill_port 5173

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 백엔드 실행
echo "백엔드 시작 중..."
cd "$ROOT_DIR/backend" || exit 1
set -a && source .env && set +a
./gradlew bootRun > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "백엔드 PID: $BACKEND_PID"

# 프론트엔드 실행
echo "프론트엔드 시작 중..."
cd "$ROOT_DIR/frontend" || exit 1
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "프론트엔드 PID: $FRONTEND_PID"

echo ""
echo "서비스가 시작되었습니다."
echo "  프론트엔드: http://localhost:5173"
echo "  백엔드:     http://localhost:8080"
echo ""
echo "로그 확인:"
echo "  tail -f /tmp/backend.log"
echo "  tail -f /tmp/frontend.log"
