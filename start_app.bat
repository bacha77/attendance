@echo off
cd /d "%~dp0"
echo Starting the Sunday School Attendance App...
start http://localhost:5175
npm run dev
