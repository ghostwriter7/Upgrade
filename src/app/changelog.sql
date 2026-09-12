-- @changeset 1
create table if not exists session
(
  id  text primary key,
  started_at  text not null default current_timestamp,
  finished_at text null,
  rpe real null
);

create index session_started_at_idx on session (started_at);

-- @changeset 2
create table if not exists exercise
(
  id text primary key,
  name text not null unique
);

-- @changeset 3
create table if not exists exercise_log
(
  id text primary key,
  exercise_id integer not null,
  session_id  integer not null,
  notes       text    null,
  'index'     integer not null,
  created_at  text    not null default current_timestamp,
  foreign key (exercise_id) references exercise (id) on delete restrict,
  foreign key (session_id) references session (id) on delete cascade
);

-- @changeset 4
create table if not exists exercise_set
(
  id text primary key,
  set_index       integer not null,
  exercise_log_id integer not null,
  type            text    not null,
  data            text    not null,
  foreign key (exercise_log_id) references exercise_log (id) on delete cascade,
  constraint uq_exercise_set_log_idx unique (exercise_log_id, set_index)
);
