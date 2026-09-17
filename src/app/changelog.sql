-- @changeset 1
create table if not exists session
(
  id         text primary key,
  started_at text not null,
  finished_at text null,
  rpe        real null
);

create index session_started_at_idx on session (started_at);

create table if not exists exercise
(
  id text primary key,
  name text not null unique
);

create table if not exists exercise_log
(
  id          text primary key,
  exercise_id text    not null,
  session_id  text    not null,
  notes       text    null,
  log_index   integer not null,
  created_at  text    not null,
  foreign key (exercise_id) references exercise (id) on delete restrict,
  foreign key (session_id) references session (id) on delete cascade
);

create index exercise_log_session_idx on exercise_log (session_id);
create index exercise_log_exercise_idx on exercise_log (exercise_id);

create table if not exists exercise_set
(
  id              text primary key,
  set_index       integer not null,
  exercise_log_id text not null,
  type            text    not null,
  data            text    not null,
  foreign key (exercise_log_id) references exercise_log (id) on delete cascade,
  constraint uq_exercise_set_log_idx unique (exercise_log_id, set_index)
);

create index exercise_set_log_idx on exercise_set (exercise_log_id);

create table if not exists media
(
  id              text primary key,
  exercise_id     text    not null,
  exercise_log_id text    not null,
  mime_type       text    not null,
  width           integer not null,
  height          integer not null,

  foreign key (exercise_id) references exercise (id) on delete restrict,
  foreign key (exercise_log_id) references exercise_log (id) on delete cascade
);

create index media_log_idx on media (exercise_log_id);
create index media_exercise_idx on media (exercise_id);

create table if not exists angle_measurement
(
  id              text primary key,
  media_id        text    not null,
  exercise_log_id text    not null,
  angle           integer not null,
  landmarks       text    not null,

  foreign key (media_id) references media (id) on delete cascade,
  foreign key (exercise_log_id) references exercise_log (id) on delete cascade
);

create index angle_measurement_log_idx on angle_measurement (exercise_log_id);
create index angle_measurement_media_idx on angle_measurement (media_id);

create table if not exists capability
(
  id   text primary key,
  name text not null unique
);

create table if not exists skill
(
  id   text primary key,
  name text not null unique
);

create table if not exists skill_capability
(
  skill_id      text    not null,
  capability_id text    not null,
  importance    integer not null,

  foreign key (skill_id) references skill (id) on delete restrict,
  foreign key (capability_id) references capability (id) on delete restrict,
  primary key (skill_id, capability_id)
);

create table if not exists exercise_capability
(
  exercise_id   text    not null,
  capability_id text    not null,
  weight        integer not null,

  foreign key (exercise_id) references exercise (id) on delete restrict,
  foreign key (capability_id) references capability (id) on delete restrict,
  primary key (exercise_id, capability_id)
);

create table if not exists target
(
  id                           text primary key,
  name                         text    not null unique,
  description                  text    null,
  skill_id                     text    not null,
  weekly_commitment_in_minutes integer not null,
  motivation                   text    not null,
  trade_offs                   text    not null,

  foreign key (skill_id) references skill (id) on delete restrict
);

-- @changeset 2
alter table exercise
  add column units_of_measurement text null;

-- @changeset 3
alter table exercise
  add column is_favourite boolean not null default false;
