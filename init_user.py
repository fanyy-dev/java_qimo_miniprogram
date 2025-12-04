import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="restaurant_db"
    )
    cursor = conn.cursor()
    
    # Drop and create user table
    cursor.execute("DROP TABLE IF EXISTS user")
    cursor.execute("""
        CREATE TABLE user (
            id BIGINT(20) NOT NULL AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            nickname VARCHAR(50),
            phone VARCHAR(20),
            user_type VARCHAR(20),
            member_level VARCHAR(20),
            points INT(11) DEFAULT 0,
            status TINYINT(1) DEFAULT 1,
            deleted TINYINT(1) DEFAULT 0,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)
    
    # Insert admin user
    cursor.execute("""
        INSERT INTO user (id, username, password, nickname, phone, user_type, member_level)
        VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'Admin', '13800138000', 'ADMIN', 'DIAMOND')
    """)
    
    conn.commit()
    print("Database initialized successfully!")
    print("Admin user created: username=admin, password=123456")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()
