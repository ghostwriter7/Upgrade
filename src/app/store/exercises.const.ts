import { BodyPart } from '@domain/enum/body-part.enum';
import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';
import { Skills, SkillTag } from '@domain/enum/skill-tag.enum';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

export const exercises: {
  id: string;
  name: string;
  description?: string;
  muscles?: string[];
  measurementDefinition?: AngleMeasurementDefinition;
  skillTags?: Skills[];
  supportedSetTypes: ExerciseSetType[];
}[] = [
  {
    id: 'arching-standing-kneeling',
    name: 'Arching (Standing / Kneeling)',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'back-squats',
    name: 'Back Squats',
    supportedSetTypes: ['weight'],
  },
  {
    id: 'bridge-heel-lifts',
    name: 'Bridge Heel Lifts',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'chin-ups',
    name: 'Chin Ups',
    skillTags: [SkillTag.OneArmChinUp],
    supportedSetTypes: ['bodyweight', 'weight'],
  },
  {
    id: 'cobra-thoracic-&-lumbar',
    name: 'Cobra (Thoracic & Lumbar)',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'couch-stretch-high',
    name: 'Couch Stretch - High',
    description: 'Hips in high position. It targets quads.',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'couch-stretch-low',
    name: 'Couch Stretch - Low',
    description: 'Hips in low position. It targets hip flexors.',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'dips',
    name: 'Dips',
    supportedSetTypes: ['bodyweight', 'weight'],
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    supportedSetTypes: ['weight'],
  },
  {
    id: 'drop-stance-squats',
    name: 'Drop Stance Squats',
    skillTags: [SkillTag.SideSplit],
    supportedSetTypes: ['bodyweight', 'weight'],
  },
  {
    id: 'front-split-slides',
    name: 'Front Split Slides',
    skillTags: [SkillTag.FrontSplit],
    supportedSetTypes: ['iso', 'bodyweight', 'weight'],
  },
  {
    id: 'hip-external-rotation-good-mornings',
    name: 'Hip External Rotation Good Mornings',
    skillTags: [SkillTag.SideSplit, SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'handstand',
    name: 'Handstand',
    skillTags: [SkillTag.Handstand],
    supportedSetTypes: ['iso'],
  },
  {
    id: 'horse-stance-squats',
    name: 'Horse Stance Squats',
    skillTags: [SkillTag.SideSplit, SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'inlocates-&-dislocates',
    name: 'Inlocates & Dislocates',
    skillTags: [SkillTag.ShoulderMobility, SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'isometric-bridge',
    name: 'Isometric Bridge',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'isometric-front-split',
    name: 'Isometric Front Split',
    skillTags: [SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'isometric-side-split',
    name: 'Isometric Side Split',
    skillTags: [SkillTag.SideSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'kneeling-needle',
    name: 'Kneeling Needle',
    skillTags: [SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'kneeling-tilt',
    name: 'Kneeling Tilt',
    skillTags: [SkillTag.SideSplit, SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'leg-elevated-pike-lift',
    name: 'Leg Elevated Pike Lift',
    skillTags: [SkillTag.FrontSplit, SkillTag.Pike],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'lindy-hop',
    name: 'Lindy Hop',
    skillTags: [SkillTag.Dance],
    supportedSetTypes: ['duration']
  },
  {
    id: 'l-sit',
    name: 'L-Sit',
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'nordic-curls',
    name: 'Nordic Curls',
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pancake-active-lifts',
    name: 'Pancake Active Lifts',
    skillTags: [SkillTag.Pancake, SkillTag.SideSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pancake-good-morning',
    name: 'Pancake Good Morning',
    measurementDefinition: {
      landmarks: [BodyPart.Knee, BodyPart.PelvisCenter, BodyPart.Chest],
    },
    skillTags: [SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-b-stance',
    name: 'Pike Good Morning - B-Stance',
    skillTags: [SkillTag.Pike, SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-leg-elevated',
    name: 'Pike Good Morning - Leg Elevated',
    skillTags: [SkillTag.Pike, SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-standing',
    name: 'Pike Good Morning Standing',
    skillTags: [SkillTag.Pike, SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    skillTags: [SkillTag.OneArmChinUp],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'push-ups',
    name: 'Push Ups',
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'reverse-nordic-curls',
    name: 'Reverse Nordic Curls',
    skillTags: [SkillTag.Bridge, SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'seated-pike-active-lifts',
    name: 'Seated Pike Active Lifts',
    skillTags: [SkillTag.Pike, SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'shoulder-external-rotation-stretch',
    name: 'Shoulder External Rotation Stretch',
    skillTags: [SkillTag.Bridge, SkillTag.ShoulderMobility],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single Leg Glute Bridge',
    skillTags: [SkillTag.Bridge],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'split-squats',
    name: 'Split Squats',
    skillTags: [SkillTag.FrontSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'standing-calf-stretch',
    name: 'Standing Calf Stretch',
    skillTags: [SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'standing-pancake-hang',
    name: 'Standing Pancake Hang',
    muscles: ['hip-flexors'],
    description:
      'Stand on two solid objects (e.g. chairs). Straddle the legs with a slight turnout of the feet. Use Contract-Relax. Hang passively, then contract hip flexors hard for 5 seconds, followed by 5 seconds of relaxing (simply hanging). Repeat for 3-5 reps. Hang longer on the last rep.',
    skillTags: [SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'straddle-jefferson-curl',
    name: 'Straddle Jefferson Curl',
    description:
      'Stand on the elevated surface. Straddle the legs with a slight feet turnout. Start tall, looking forward. Tuck the chin. Articulate spine vertebrae by vertebrae. Allow the arms to naturally come out. At the bottom, contract the hip flexors. Reverse the motion.',
    muscles: ['hip-flexors', 'spine'],
    skillTags: [SkillTag.Pancake],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'tailors-pose',
    name: 'Tailors Pose',
    description:
      'Sit against a wall. Keep upright posture. Pull feet in, heels touching. Test your unloaded range of motion. Select a dumbbell/kettlebell with just enough weight to increase your range slightly. Use weight in range of 4-10kg, the goal is to use little weight as possible. Sit on the blocks or objects if your knees can touch the floor. Focus on the bottom of the rep. Remember to teach your adductors how to relax in the bottom of the position.',
    muscles: ['adductors'],
    measurementDefinition: {
      landmarks: [BodyPart.RightKnee, BodyPart.PelvisCenter, BodyPart.LeftKnee],
    },
    skillTags: [SkillTag.Pancake, SkillTag.SideSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'tailor-pose-straight-arm-lifts',
    name: 'Tailor Pose - Straight Arm Lifts',
    description:
      'Sit on the floor with the feet together. No need for a wall. Grab a light weight - 2-5kg. Lean forwards reaching your arms straight out. If you cannot create enough pelvic tilt to lean forward, you can elevate your hips slightly (sit on a block). Drill best suited for someone with a head-to-floor pancake. Use an object as a marker to reach for. Press down with the feed whilst pulling the knees apart. Contract-Relax (5 seconds) works well.',
    muscles: ['adductors'],
    skillTags: [SkillTag.Pancake, SkillTag.SideSplit],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
];
