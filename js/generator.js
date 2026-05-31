const objects = ['teapot', 'storybook', 'paint tube', 'pencil case', 'moon cookie', 'tiny boot'];
const moods = ['grumpy', 'cozy', 'shy', 'dramatic', 'sleepy', 'sparkly'];
const magicBits = ['floating stars', 'steam curls', 'tiny bandage', 'pocket label', 'moon freckles', 'glowing sticker'];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateLivingObject() {
  const object = pick(objects);
  const mood = pick(moods);
  const detail = pick(magicBits);
  const name = `${mood[0].toUpperCase()}${mood.slice(1)} ${object}`;
  return {
    title: `Draw a ${name}`,
    character_name: name,
    category: 'generated-living-object',
    estimated_minutes: 10,
    recipe: [
      `Block in the ${object} with one simple rounded silhouette.`,
      `Add a ${mood} face using eyebrow angle, eye size, and mouth shape.`,
      `Add ${detail} outside the main silhouette.`,
      `Clean the outline, fill a limited palette, and add tiny texture marks.`
    ],
    logic: 'Template + weighted randomness + constraint: keep one clear silhouette, one emotion, one magic detail.'
  };
}

export function generateMagicItem() {
  const item = pick(['wand', 'bookmark', 'eraser', 'key', 'sticker sheet']);
  const power = pick(['calms grumpy books', 'summons snack breaks', 'turns mistakes into sparkles', 'finds hidden sketch layers']);
  return {
    title: `Magic ${item}`,
    prompt: `Design a magic ${item} that ${power}.`,
    constraints: ['rounded silhouette', 'one face', 'one readable symbol', 'three-color palette'],
    logic: 'Rule-driven prompt generation with fixed constraints for beginner-friendly drawing.'
  };
}

export function generateName() {
  return pick(['Scribble', 'Mugbun', 'Bubblebun', 'Chomp', 'Noodlewick', 'Pebblepop']);
}
