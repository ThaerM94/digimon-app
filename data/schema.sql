DROP TABLE IF EXISTS heros;
CREATE TABLE heros(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    image_url VARCHAR(255),
    level TEXT
);