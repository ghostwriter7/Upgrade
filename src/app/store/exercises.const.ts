import { BodyPart } from '@domain/enum/body-part.enum';
import { Exercise, ExerciseCapability } from '@domain/model/exercise.model';
import { CapabilityId } from '@store/capabilities.const';

const capability = (capabilityId: CapabilityId, weight: number): ExerciseCapability => ({
  capabilityId,
  weight,
});

export const exercises: Exercise[] = [
  {
    id: 'abductor-machine',
    name: 'Abductor Machine',
    capabilities: [capability('abductors-strength', 1)],
    supportedSetTypes: ['weight'],
  },
  {
    id: 'adductor-machine',
    name: 'Adductor Machine',
    capabilities: [capability('adductor-extensibility', 1)],
    supportedSetTypes: ['weight'],
  },
  {
    id: 'archer-pull-ups',
    name: 'Archer Pull-Ups',
    capabilities: [
      capability('vertical-pulling-strength', 1),
      capability('grip-and-hanging-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'weight', 'iso'],
  },
  {
    id: 'arching-standing-kneeling',
    name: 'Arching (Standing / Kneeling)',
    capabilities: [
      capability('thoracic-extension', 0.8),
      capability('hip-flexor-extensibility', 0.6),
    ],
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
    capabilities: [
      capability('shoulder-flexion', 0.9),
      capability('shoulder-external-rotation', 0.7),
      capability('thoracic-extension', 0.7),
      capability('hip-flexor-extensibility', 0.4),
    ],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'chin-ups',
    name: 'Chin Ups',
    capabilities: [
      capability('vertical-pulling-strength', 1),
      capability('grip-and-hanging-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'weight'],
  },
  {
    id: 'cobra-thoracic-&-lumbar',
    name: 'Cobra (Thoracic & Lumbar)',
    capabilities: [capability('thoracic-extension', 1.0)],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'couch-stretch-high',
    name: 'Couch Stretch - High',
    capabilities: [capability('hip-flexor-extensibility', 1.0)],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'couch-stretch-low',
    name: 'Couch Stretch - Low',
    capabilities: [capability('hip-flexor-extensibility', 0.9)],
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
    id: 'dragon-squats',
    name: 'Dragon Squats',
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'drop-stance-squats',
    name: 'Drop Stance Squats',
    capabilities: [capability('adductor-extensibility', 0.8)],
    supportedSetTypes: ['bodyweight', 'weight'],
  },
  {
    id: 'front-split-slides',
    name: 'Front Split Slides',
    capabilities: [
      capability('hip-flexor-extensibility', 0.8),
      capability('hamstring-extensibility', 0.8),
      capability('hamstring-end-range-strength', 0.8),
    ],
    supportedSetTypes: ['iso', 'bodyweight', 'weight'],
  },
  {
    id: 'german-hang',
    name: 'German Hang',
    capabilities: [
      capability('shoulder-flexion', 0.8),
      capability('shoulder-external-rotation', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'hip-external-rotation-good-mornings',
    name: 'Hip External Rotation Good Mornings',
    capabilities: [
      capability('adductor-extensibility', 0.6),
      capability('hamstring-extensibility', 0.5),
    ],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'handstand',
    name: 'Handstand',
    supportedSetTypes: ['iso'],
  },
  {
    id: 'horse-stance-squats',
    name: 'Horse Stance Squats',
    capabilities: [
      capability('adductor-extensibility', 0.8),
      capability('abductors-strength', 0.7),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'inlocates-&-dislocates',
    name: 'Inlocates & Dislocates',
    capabilities: [
      capability('shoulder-flexion', 0.9),
      capability('shoulder-external-rotation', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'isometric-bridge',
    name: 'Isometric Bridge',
    capabilities: [
      capability('shoulder-flexion', 0.8),
      capability('shoulder-external-rotation', 0.7),
      capability('thoracic-extension', 0.7),
    ],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'isometric-front-split',
    name: 'Isometric Front Split',
    capabilities: [
      capability('hip-flexor-extensibility', 1.0),
      capability('hamstring-extensibility', 1.0),
      capability('hamstring-end-range-strength', 0.9),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'isometric-side-split',
    name: 'Isometric Side Split',
    capabilities: [
      capability('adductor-extensibility', 1.0),
      capability('abductors-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'kneeling-needle',
    name: 'Kneeling Needle',
    capabilities: [capability('hip-flexor-extensibility', 0.8)],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'kneeling-tilt',
    name: 'Kneeling Tilt',
    capabilities: [
      capability('adductor-extensibility', 0.8),
      capability('abductors-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'leg-elevated-pike-lift',
    name: 'Leg Elevated Pike Lift',
    capabilities: [
      capability('hamstring-extensibility', 0.7),
      capability('active-hip-flexion', 0.9),
      capability('hamstring-end-range-strength', 0.7),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
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
    capabilities: [
      capability('adductor-extensibility', 0.8),
      capability('active-hip-flexion', 1.0),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pancake-good-morning',
    name: 'Pancake Good Morning',
    measurementDefinition: {
      landmarks: [BodyPart.Knee, BodyPart.PelvisCenter, BodyPart.Chest],
    },
    capabilities: [
      capability('adductor-extensibility', 0.8),
      capability('hamstring-extensibility', 0.8),
      capability('active-hip-flexion', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-b-stance',
    name: 'Pike Good Morning - B-Stance',
    capabilities: [
      capability('hamstring-extensibility', 0.8),
      capability('active-hip-flexion', 0.7),
      capability('hamstring-end-range-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-leg-elevated',
    name: 'Pike Good Morning - Leg Elevated',
    capabilities: [
      capability('hamstring-extensibility', 0.9),
      capability('active-hip-flexion', 0.9),
      capability('hamstring-end-range-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pike-good-morning-standing',
    name: 'Pike Good Morning Standing',
    capabilities: [
      capability('hamstring-extensibility', 0.8),
      capability('active-hip-flexion', 0.7),
      capability('hamstring-end-range-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pistols',
    name: 'Pistols',
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    capabilities: [
      capability('vertical-pulling-strength', 1),
      capability('grip-and-hanging-strength', 0.8),
    ],
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
    capabilities: [capability('hip-flexor-extensibility', 0.9)],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'seated-pike-active-lifts',
    name: 'Seated Pike Active Lifts',
    capabilities: [
      capability('hamstring-extensibility', 0.5),
      capability('active-hip-flexion', 1.0),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'shoulder-external-rotation-stretch',
    name: 'Shoulder External Rotation Stretch',
    capabilities: [capability('shoulder-external-rotation', 1.0)],
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single Leg Glute Bridge',
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'skin-the-cat',
    name: 'Skin The Cat',
    capabilities: [
      capability('shoulder-flexion', 0.8),
      capability('shoulder-external-rotation', 0.7),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'split-squats',
    name: 'Split Squats',
    capabilities: [
      capability('hip-flexor-extensibility', 0.5),
      capability('hamstring-end-range-strength', 0.3),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'standing-calf-stretch',
    name: 'Standing Calf Stretch',
    supportedSetTypes: ['bodyweight', 'iso'],
  },
  {
    id: 'standing-pancake-hang',
    name: 'Standing Pancake Hang',
    capabilities: [
      capability('hamstring-extensibility', 0.9),
      capability('adductor-extensibility', 0.6),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'straddle-jefferson-curl',
    name: 'Straddle Jefferson Curl',
    capabilities: [
      capability('adductor-extensibility', 0.8),
      capability('hamstring-extensibility', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'tailors-pose',
    name: 'Tailors Pose',
    capabilities: [capability('adductor-extensibility', 0.7)],
    measurementDefinition: {
      landmarks: [BodyPart.RightKnee, BodyPart.PelvisCenter, BodyPart.LeftKnee],
    },
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'tailor-pose-straight-arm-lifts',
    name: 'Tailor Pose - Straight Arm Lifts',
    capabilities: [capability('adductor-extensibility', 0.7)],
    supportedSetTypes: ['bodyweight', 'iso', 'weight'],
  },
  {
    id: 'uneven-chin-ups',
    name: 'Uneven Chin-Ups',
    capabilities: [
      capability('vertical-pulling-strength', 1),
      capability('grip-and-hanging-strength', 0.8),
    ],
    supportedSetTypes: ['bodyweight', 'weight', 'iso'],
  },
];
