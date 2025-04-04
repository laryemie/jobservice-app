CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'worker', 'client') NOT NULL,
    login_attempts INT DEFAULT 0,
    reset_password BOOLEAN DEFAULT FALSE
);

CREATE TABLE Worker (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    skills TEXT,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    description TEXT,
    time_of_execution DATE,
    state INT,
    FOREIGN KEY (client_id) REFERENCES Client(id)
);