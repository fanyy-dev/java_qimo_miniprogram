@echo off
chcp 65001
echo ========================================
echo 饭店管理系统 - 启动脚本
echo ========================================
echo.

echo 1. 检查MySQL数据库...
mysql -u root -p123456 -e "USE restaurant_db;" 2>nul
if %errorlevel% neq 0 (
    echo 数据库不存在,正在创建...
    mysql -u root -p123456 < backend\src\main\resources\sql\init.sql
    if %errorlevel% equ 0 (
        echo 数据库创建成功!
    ) else (
        echo 数据库创建失败,请检查MySQL配置
        pause
        exit /b 1
    )
) else (
    echo 数据库已存在
)

echo.
echo 2. 启动后端服务...
cd backend
start "Restaurant Backend" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo 后端服务启动中...
echo 访问地址: http://localhost:8080/api
echo.
echo 小程序开发:
echo   请使用微信开发者工具打开: frontend/miniprogram
echo.
echo 后台管理系统:
echo   cd frontend/admin
echo   npm install
echo   npm run serve
echo.
echo 按任意键退出...
pause >nul
