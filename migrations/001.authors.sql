CREATE TABLE authors
(
  id INTEGER PRIMARY KEY,
  name varchar(255),
  email varchar(255) UNIQUE,
  createDate datetime
);
