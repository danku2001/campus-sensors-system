-- Campus Sensors & Shading - Schema 

CREATE DATABASE IF NOT EXISTS campus_sensors
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campus_sensors;

SET default_storage_engine=INNODB;

-- areas
CREATE TABLE IF NOT EXISTS areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(255),
  width INT,
  height INT
) ENGINE=InnoDB;

-- sensors
CREATE TABLE IF NOT EXISTS sensors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  x INT NOT NULL,
  y INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sensors_area (area_id),
  CONSTRAINT fk_sensors_area
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- sensor_values (for future use after we add real sensors)
CREATE TABLE IF NOT EXISTS sensor_values (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sensor_id INT NOT NULL,
  metric VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  value DECIMAL(10,3) NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_value_sensor_time (sensor_id, recorded_at),
  CONSTRAINT fk_values_sensor
    FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- shading_systems
CREATE TABLE IF NOT EXISTS shading_systems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area_id INT NOT NULL,
  status ENUM('open','closed') NOT NULL DEFAULT 'closed',
  added_by_user TINYINT(1) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_area (area_id),
  CONSTRAINT fk_shading_area
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

