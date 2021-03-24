create table reports
 (
  report_id uuid DEFAULT uuid_generate_v4(),
   constraint reports_pk
   primary key(report_id),
  user_id uuid
   constraint reports_users_user_id_fk
    references users,
 characteristic varchar,
  latitude numeric,
  longitude numeric,
 location varchar,
  uploadTime timestamp,
 description varchar,
 photo bytea
);

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);