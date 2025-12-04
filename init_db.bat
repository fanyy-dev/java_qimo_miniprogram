@echo off
mysql -u root -p123456 restaurant_db < "g:\fandianapp\backend\src\main\resources\sql\init.sql"
pause
