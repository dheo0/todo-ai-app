#!/bin/bash

# 포트 사용 중인 프로세스 종료 함수
kill_port() {
  local port=$1
  local pid
  pid=$(lsof -ti :"$port" 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "포트 $port 사용 중인 프로세스(PID: $pid) 종료 중..."
    kill -9 $pid 2>/dev/null
    sleep 1
  else
    echo "포트 $port 를 사용 중인 프로세스가 없습니다."
  fi
}

echo "서비스 정지 시작..."

# 백엔드(8080) 및 프론트엔드(5173) 포트 종료
kill_port 8080
kill_port 5173

echo "모든 서비스가 정지되었습니다."
