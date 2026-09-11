export const Changelog: {
  summary: string;
  changes: string[];
  date: string;
  version: number;
}[] = [
  {
    version: 1,
    summary: 'Create `sessions` table',
    changes: [
      `
        create table if not exists sessions
        (
          id          integer primary key autoincrement,
          started_at  text not null default current_timestamp,
          finished_at text null,
          rpe         real null,
          created_at  text not null default current_timestamp
        );
      `,
    ],
    date: '2026-09-11',
  },
];
