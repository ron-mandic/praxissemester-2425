import { pipeline } from '@xenova/transformers';

export const detector = await pipeline('object-detection', 'Xenova/yolos-tiny');
