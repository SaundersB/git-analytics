CREATE TABLE commits
(
  id INTEGER PRIMARY KEY,
  commitId varchar(255),
  authorId INTEGER,
  committerId INTEGER,
  comment varchar(255),
  addChanges INTEGER,
  editChanges INTEGER,
  deleteChanges INTEGER,
  url varchar(255),
  remoteUrl varchar(255)
);
