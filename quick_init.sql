DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  user_type VARCHAR(20) DEFAULT 'USER',
  member_level VARCHAR(20) DEFAULT 'NORMAL',
  points INT(11) DEFAULT 0,
  status TINYINT(1) DEFAULT 1,
  deleted TINYINT(1) DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO user (id, username, password, nickname, phone, user_type, member_level) 
VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '管理员', '13800138000', 'ADMIN', 'DIAMOND');
