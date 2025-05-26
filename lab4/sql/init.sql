-- Видалення таблиць
DROP TABLE IF EXISTS dates CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS forecasts CASCADE;

-- Таблиця dates
CREATE TABLE IF NOT EXISTS dates (
    id INT PRIMARY KEY,
    date DATE NOT NULL,
    is_weekend BOOLEAN NOT NULL
);

-- Таблиця locations
CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY,
    name VARCHAR(24) NOT NULL
);

DROP TYPE IF EXISTS enum_cloud_type CASCADE;
CREATE TYPE enum_cloud_type AS ENUM ('сонячно', 'частково хмарно', 'хмарно');
DROP TYPE IF EXISTS enum_wind_direction CASCADE;
CREATE TYPE enum_wind_direction AS ENUM ('Зх', 'Сх', 'Пн', 'Пд', 'ПнЗх', 'ПнСх', 'ПдЗх', 'ПдСх');

-- Таблиця forecasts
CREATE TABLE IF NOT EXISTS forecasts (
    id INT PRIMARY KEY,
    location_id INT NOT NULL REFERENCES locations(id),
    date_id INT NOT NULL REFERENCES dates(id),
    hour INT NOT NULL,
    temperature INT NOT NULL,
    wind_direction enum_wind_direction NOT NULL,
    wind_speed INT NOT NULL,
    precipitation NUMERIC NOT NULL,
    cloud_type enum_cloud_type NOT NULL,
    is_rain BOOLEAN NOT NULL,
    is_thunderstorm BOOLEAN NOT NULL,
    is_snow BOOLEAN NOT NULL,
    is_hail BOOLEAN NOT NULL
);

-- Вставка даних
COPY dates
FROM '/docker-entrypoint-initdb.d/dates.csv'
WITH (FORMAT csv, HEADER true);

COPY locations
FROM '/docker-entrypoint-initdb.d/locations.csv'
WITH (FORMAT csv, HEADER true);

COPY forecasts
FROM '/docker-entrypoint-initdb.d/forecasts.csv'
WITH (FORMAT csv, HEADER true);