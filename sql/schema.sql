--
-- cars table
--
DROP TABLE IF EXISTS cars;
CREATE TABLE cars(
    id 						            SERIAL PRIMARY KEY,
    gos_number                          VARCHAR(6) NOT NULL
);

INSERT INTO cars (gos_number)
    VALUES
        ('x123xx'),
        ('x444xx'),
        ('x122ww'),
        ('x113yu'),
        ('x333ty');

--
-- books table
--
DROP TABLE IF EXISTS books;
CREATE TABLE books(
    id 						            SERIAL PRIMARY KEY,
    car_id                              INTEGER NOT NULL REFERENCES cars ON DELETE CASCADE,
    start_booked                        TIMESTAMP,
    end_booked                          TIMESTAMP
);