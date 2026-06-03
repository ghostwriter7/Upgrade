import { BodyPart } from '@domain/enum/body-part.enum';
import { AngleMeasurementDefinition } from '@domain/interface/angle-measurement-definition.interface';

export const exercises: {
  id: string;
  name: string;
  description?: string;
  muscles?: string[];
  measurementDefinition?: AngleMeasurementDefinition;
}[] = [
  {
    id: 'arching-standing-kneeling',
    name: 'Arching (Standing / Kneeling)',
  },
  {
    id: 'back-squats',
    name: 'Back Squats',
  },
  {
    id: 'bridge-heel-lifts',
    name: 'Bridge Heel Lifts',
  },
  {
    id: 'chin-ups',
    name: 'Chin Ups',
  },
  {
    id: 'cobra-thoracic-&-lumbar',
    name: 'Cobra (Thoracic & Lumbar)',
  },
  {
    id: 'couch-stretch-high',
    name: 'Couch Stretch - High',
    description: 'Hips in high position. It targets quads.',
  },
  {
    id: 'couch-stretch-low',
    name: 'Couch Stretch - Low',
    description: 'Hips in low position. It targets hip flexors.',
  },
  {
    id: 'dips',
    name: 'Dips',
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
  },
  {
    id: 'drop-stance-squats',
    name: 'Drop Stance Squats',
  },
  {
    id: 'front-split-slides',
    name: 'Front Split Slides',
  },
  {
    id: 'hip-external-rotation-good-mornings',
    name: 'Hip External Rotation Good Mornings',
  },
  {
    id: 'handstand',
    name: 'Handstand',
  },
  {
    id: 'horse-stance-squats',
    name: 'Horse Stance Squats',
  },
  {
    id: 'inlocates-&-dislocates',
    name: 'Inlocates & Dislocates',
  },
  {
    id: 'isometric-bridge',
    name: 'Isometric Bridge',
  },
  {
    id: 'isometric-front-split',
    name: 'Isometric Front Split',
  },
  {
    id: 'isometric-side-split',
    name: 'Isometric Side Split',
  },
  {
    id: 'kneeling-needle',
    name: 'Kneeling Needle',
  },
  {
    id: 'kneeling-tilt',
    name: 'Kneeling Tilt',
  },
  {
    id: 'leg-elevated-pike-lift',
    name: 'Leg Elevated Pike Lift',
  },
  {
    id: 'l-sit',
    name: 'L-Sit',
  },
  {
    id: 'nordic-curls',
    name: 'Nordic Curls',
  },
  {
    id: 'pancake-active-lifts',
    name: 'Pancake Active Lifts',
  },
  {
    id: 'pancake-good-morning',
    name: 'Pancake Good Morning',
  },
  {
    id: 'pike-good-morning-b-stance',
    name: 'Pike Good Morning - B-Stance',
  },
  {
    id: 'pike-good-morning-leg-elevated',
    name: 'Pike Good Morning - Leg Elevated',
  },
  {
    id: 'pike-good-morning-standing',
    name: 'Pike Good Morning Standing',
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
  },
  {
    id: 'push-ups',
    name: 'Push Ups',
  },
  {
    id: 'reverse-nordic-curls',
    name: 'Reverse Nordic Curls',
  },
  {
    id: 'seated-pike-active-lifts',
    name: 'Seated Pike Active Lifts',
  },
  {
    id: 'shoulder-external-rotation-stretch',
    name: 'Shoulder External Rotation Stretch',
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single Leg Glute Bridge',
  },
  {
    id: 'split-squats',
    name: 'Split Squats',
  },
  {
    id: 'standing-calf-stretch',
    name: 'Standing Calf Stretch',
  },
  {
    id: 'standing-pancake-hang',
    name: 'Standing Pancake Hang',
    muscles: ['hip-flexors'],
    description:
      'Stand on two solid objects (e.g. chairs). Straddle the legs with a slight turnout of the feet. Use Contract-Relax. Hang passively, then contract hip flexors hard for 5 seconds, followed by 5 seconds of relaxing (simply hanging). Repeat for 3-5 reps. Hang longer on the last rep.',
  },
  {
    id: 'straddle-jefferson-curl',
    name: 'Straddle Jefferson Curl',
    description:
      'Stand on the elevated surface. Straddle the legs with a slight feet turnout. Start tall, looking forward. Tuck the chin. Articulate spine vertebrae by vertebrae. Allow the arms to naturally come out. At the bottom, contract the hip flexors. Reverse the motion.',
    muscles: ['hip-flexors', 'spine'],
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
  },
  {
    id: 'tailor-pose-straight-arm-lifts',
    name: 'Tailor Pose - Straight Arm Lifts',
    description:
      'Sit on the floor with the feet together. No need for a wall. Grab a light weight - 2-5kg. Lean forwards reaching your arms straight out. If you cannot create enough pelvic tilt to lean forward, you can elevate your hips slightly (sit on a block). Drill best suited for someone with a head-to-floor pancake. Use an object as a marker to reach for. Press down with the feed whilst pulling the knees apart. Contract-Relax (5 seconds) works well.',
    muscles: ['adductors'],
  },
];
