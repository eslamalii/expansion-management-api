USE expansion_management;

DROP TABLE IF EXISTS `match`;
DROP TABLE IF EXISTS `project`;
DROP TABLE IF EXISTS `vendor`;
DROP TABLE IF EXISTS `client`;

-- =================================================================
-- CREATE TABLES
-- =================================================================
CREATE TABLE `client` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NOT NULL UNIQUE,
    `contact_email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL DEFAULT 'client',
    PRIMARY KEY (`id`)
);

CREATE TABLE `vendor` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `countries_supported` JSON NOT NULL,  
    `services_offered` JSON NOT NULL,     
    `rating` DECIMAL(2, 1) NOT NULL,
    `response_sla_hours` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `project` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(255) NOT NULL,
    `services_needed` TEXT NOT NULL,  
    `budget` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    `clientId` INT NULL,              
    PRIMARY KEY (`id`),
    FOREIGN KEY (`clientId`) REFERENCES `client`(`id`)
);

CREATE TABLE `match` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `score` DECIMAL(5, 2) NOT NULL,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `projectId` INT NULL,
    `vendorId` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`vendorId`) REFERENCES `vendor`(`id`) ON DELETE CASCADE
);
-- =================================================================
-- INSERT SAMPLE DATA
-- =================================================================

-- Password for all users: 'password123'
SET @hashed_password = '$2b$10$mQN0xRQFL2ZCi3MrCeiJjeRjg56ko9G5Yr/KfiKztItkgZJXlSZEO';

-- Insert Clients
INSERT INTO `client` (`company_name`, `contact_email`, `password`, `role`) VALUES
('System Admin', 'cenodi5146@cavoyar.com', @hashed_password, 'admin'),
('TechCorp International', 'contact@techcorp.com', @hashed_password, 'client'),
('Global Innovations Ltd', 'hello@globalinnovations.com', @hashed_password, 'client'),
('Digital Ventures Inc', 'info@digitalventures.com', @hashed_password, 'client'),
('NextGen Solutions', 'contact@nextgen.com', @hashed_password, 'client'),
('Startup Hub', 'team@startuphub.com', @hashed_password, 'client'),
('Enterprise Plus', 'business@enterpriseplus.com', @hashed_password, 'client');

-- Insert Vendors
INSERT INTO `vendor` (`name`, `countries_supported`, `services_offered`, `rating`, `response_sla_hours`) VALUES
('Digital Marketing Pro', '["USA", "Canada", "UK"]', '["SEO", "PPC", "Social Media Marketing", "Content Marketing"]', 4.8, 12),
('WebDev Masters', '["USA", "Germany", "Netherlands", "UK"]', '["Web Development", "Mobile Apps", "API Integration", "E-commerce"]', 4.9, 8),
('CloudTech Solutions', '["USA", "UK", "Germany", "France"]', '["Cloud Migration", "AWS Services", "DevOps", "Cybersecurity"]', 4.7, 16),
('Design Studio Elite', '["USA", "Canada", "UK", "Australia"]', '["UI/UX Design", "Branding", "Graphic Design", "Web Design"]', 5.0, 6),
('Euro Logistics Network', '["Germany", "France", "Spain", "Italy"]', '["Shipping", "Warehousing", "Supply Chain", "Last Mile Delivery"]', 4.6, 24),
('Asia Pacific Tech', '["Japan", "South Korea", "Singapore", "Australia"]', '["Mobile Apps", "AI/ML", "Blockchain", "IoT Solutions"]', 4.8, 10),
('Legal Advisors Global', '["USA", "UK", "Canada"]', '["Legal Consulting", "Contract Review", "IP Protection", "Compliance"]', 4.9, 48),
('Translation Hub', '["USA", "Germany", "Japan", "Spain", "France", "China"]', '["Translation", "Localization", "Cultural Consulting", "Content Adaptation"]', 4.8, 20),
('Research & Analytics Co', '["USA", "UK", "Germany", "Canada"]', '["Market Research", "Data Analytics", "Business Intelligence", "Competitive Analysis"]', 4.7, 72),
('Rapid Development Team', '["India", "Philippines", "Ukraine", "Poland"]', '["Web Development", "Mobile Apps", "Software Testing", "Technical Support"]', 4.6, 18),
('Nordic Solutions', '["Sweden", "Norway", "Denmark", "Finland"]', '["Software Development", "Green Tech", "SaaS Solutions", "Consulting"]', 4.8, 14),
('MENA Tech Partners', '["UAE", "Saudi Arabia", "Egypt", "Jordan"]', '["Digital Transformation", "Mobile Apps", "E-commerce", "Cloud Services"]', 4.7, 22);


-- Insert Projects
INSERT INTO `project` (`clientId`, `country`, `services_needed`, `budget`, `status`) VALUES
((SELECT id FROM client WHERE company_name = 'TechCorp International'), 'USA', 'Web Development,E-commerce,Payment Integration', 150000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'TechCorp International'), 'USA', 'SEO,Content Marketing', 25000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'TechCorp International'), 'Canada', 'Mobile Apps,API Integration', 120000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Global Innovations Ltd'), 'Germany', 'Cloud Migration,AWS Services,DevOps', 200000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Global Innovations Ltd'), 'UK', 'Branding,Web Design,Graphic Design', 75000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Digital Ventures Inc'), 'Japan', 'AI/ML,API Integration,Technical Support', 95000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Digital Ventures Inc'), 'USA', 'Market Research,Data Analytics,Business Intelligence', 45000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'NextGen Solutions'), 'Germany', 'Supply Chain,Warehousing,Consulting', 180000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'NextGen Solutions'), 'France', 'Translation,Localization,Web Development', 60000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Startup Hub'), 'India', 'Web Development,Mobile Apps,Technical Support', 35000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Startup Hub'), 'USA', 'Legal Consulting,Compliance,Contract Review', 20000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Enterprise Plus'), 'UK', 'Cybersecurity,Consulting,Compliance', 85000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'Enterprise Plus'), 'Sweden', 'Green Tech,SaaS Solutions,Consulting', 125000.00, 'active'),
((SELECT id FROM client WHERE company_name = 'TechCorp International'), 'USA', 'Web Design,Branding', 40000.00, 'completed'),
((SELECT id FROM client WHERE company_name = 'Global Innovations Ltd'), 'UK', 'Graphic Design,Branding', 8000.00, 'completed');
