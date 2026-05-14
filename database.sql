-- ============================================================
--  Mongolian Hunting Quest — MySQL Database Schema
--  Generated from create-table.txt
--  Fixes applied:
--    1. Table order corrected for FK dependencies
--    2. "Users" → "users" case unified
--    3. Auction moved before Payment (FK dependency)
--    4. DROP TABLE added for clean re-run
-- ============================================================

CREATE DATABASE IF NOT EXISTS mongolian_hunting_quest
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mongolian_hunting_quest;

-- ── Drop in reverse FK order ──────────────────────────────────
DROP TABLE IF EXISTS Foreigner;
DROP TABLE IF EXISTS Guide;
DROP TABLE IF EXISTS SpeciesQuota;
DROP TABLE IF EXISTS PersonalQuota;
DROP TABLE IF EXISTS Bid;
DROP TABLE IF EXISTS AuctionRegistration;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Permit;
DROP TABLE IF EXISTS Auction;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Animal;
DROP TABLE IF EXISTS RangeArea;
DROP TABLE IF EXISTS Soum;
DROP TABLE IF EXISTS Province;

-- ── 1. Province ───────────────────────────────────────────────
CREATE TABLE Province (
    province_id INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL
);

-- ── 2. Soum ───────────────────────────────────────────────────
CREATE TABLE Soum (
    soum_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    province_id INT,
    FOREIGN KEY (province_id) REFERENCES Province(province_id)
);

-- ── 3. RangeArea ──────────────────────────────────────────────
CREATE TABLE RangeArea (
    range_id INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100),
    polygon  TEXT,           -- coordinates stored as JSON/text
    soum_id  INT,
    FOREIGN KEY (soum_id) REFERENCES Soum(soum_id)
);

-- ── 4. Animal ─────────────────────────────────────────────────
CREATE TABLE Animal (
    animal_id    INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100),
    latin_name   VARCHAR(150),
    species      VARCHAR(100),
    genus        VARCHAR(100),
    family       VARCHAR(100),
    tax_order    VARCHAR(100),
    class        VARCHAR(100),
    gen_info     TEXT,
    bio_info     TEXT,
    environment  TEXT,
    status       VARCHAR(50),
    base_price   DECIMAL(10,2),
    picture_path VARCHAR(255)
);

-- ── 5. users ──────────────────────────────────────────────────
CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100),
    surname         VARCHAR(100),
    email           VARCHAR(150) UNIQUE,
    phone           VARCHAR(20),
    address         TEXT,
    password_hash   VARCHAR(255) NOT NULL,
    citizenship     VARCHAR(100),
    registration_no VARCHAR(50),
    dob             DATE,
    id_picture_path VARCHAR(255)
);

-- ── 6. Company ────────────────────────────────────────────────
CREATE TABLE Company (
    company_id    INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    government_id VARCHAR(100) UNIQUE,
    email         VARCHAR(150),
    phone         VARCHAR(50),
    address       TEXT
);

-- ── 7. Auction ────────────────────────────────────────────────
CREATE TABLE Auction (
    auction_id  INT AUTO_INCREMENT PRIMARY KEY,
    start_date  DATETIME,
    end_date    DATETIME,
    description TEXT,
    range_id    INT,
    animal_id   INT,
    FOREIGN KEY (range_id)  REFERENCES RangeArea(range_id),
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
);

-- ── 8. Permit ─────────────────────────────────────────────────
CREATE TABLE Permit (
    permit_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    animal_id  INT,
    range_id   INT,
    from_date  DATE,
    to_date    DATE,
    price      DECIMAL(10,2),
    status     ENUM('PENDING_PAYMENT','ACTIVE','EXPIRED','CANCELLED')
               DEFAULT 'PENDING_PAYMENT',
    expires_at DATETIME,
    FOREIGN KEY (user_id)   REFERENCES users(user_id),
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id),
    FOREIGN KEY (range_id)  REFERENCES RangeArea(range_id)
);

-- ── 9. Payment ────────────────────────────────────────────────
CREATE TABLE Payment (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    permit_id      INT NULL,
    auction_id     INT NULL,
    transaction_id VARCHAR(100),
    amount         DECIMAL(10,2),
    payment_code   VARCHAR(50) UNIQUE,
    bank_account   VARCHAR(100),
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permit_id)  REFERENCES Permit(permit_id),
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id)
);

-- ── 10. AuctionRegistration ───────────────────────────────────
CREATE TABLE AuctionRegistration (
    auction_id INT,
    user_id    INT,
    status     ENUM('PENDING','PAID','CANCELLED') DEFAULT 'PENDING',
    PRIMARY KEY (auction_id, user_id),
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id),
    FOREIGN KEY (user_id)    REFERENCES users(user_id)
);

-- ── 11. Bid ───────────────────────────────────────────────────
CREATE TABLE Bid (
    bid_id     INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT,
    user_id    INT,
    amount     DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES Auction(auction_id),
    FOREIGN KEY (user_id)    REFERENCES users(user_id)
);

-- ── 12. PersonalQuota ─────────────────────────────────────────
CREATE TABLE PersonalQuota (
    quota_id     INT AUTO_INCREMENT PRIMARY KEY,
    soum_id      INT,
    year         INT,
    type         ENUM('HOUSEHOLD','SPECIAL'),
    max_per_user INT,
    FOREIGN KEY (soum_id) REFERENCES Soum(soum_id)
);

-- ── 13. SpeciesQuota ──────────────────────────────────────────
CREATE TABLE SpeciesQuota (
    quota_id  INT AUTO_INCREMENT PRIMARY KEY,
    range_id  INT,
    year      INT,
    animal_id INT,
    total     INT,
    given     INT DEFAULT 0,
    FOREIGN KEY (range_id)  REFERENCES RangeArea(range_id),
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
);

-- ── 14. Guide ─────────────────────────────────────────────────
CREATE TABLE Guide (
    user_id    INT PRIMARY KEY,
    company_id INT,
    position   VARCHAR(100),
    FOREIGN KEY (user_id)    REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

-- ── 15. Foreigner ─────────────────────────────────────────────
CREATE TABLE Foreigner (
    user_id            INT PRIMARY KEY,
    passport_no        VARCHAR(100),
    passport_photo_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
