import { Skill } from '@domain/model/skill';
import { Bridge } from '@store/skills/bridge';
import { SideSplit } from '@store/skills/side-split';
import { FrontSplit } from '@store/skills/front-split';
import { Pancake } from '@store/skills/pancake';
import { Pike } from '@store/skills/pike';
import { OneArmChinUp } from '@store/skills/one-arm-chin-up';

export const skills: Skill[] = [Bridge, SideSplit, FrontSplit, Pancake, Pike, OneArmChinUp];
