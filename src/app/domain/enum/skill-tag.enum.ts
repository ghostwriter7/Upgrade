export const SkillTag = {
  Bridge: 'bridge',
  FrontSplit: 'front_split',
  Handstand: 'handstand',
  OneArmChinUp: 'one_arm_chin_up',
  Pancake: 'pancake',
  Pike: 'pike',
  ShoulderMobility: 'shoulder_mobility',
  SideSplit: 'side_split',
} as const;

export type Skills = typeof SkillTag[keyof typeof SkillTag];

