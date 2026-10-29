import type { ImageMetadata } from 'astro';
import ralphWide from '../assets/work-02.png';
import ralphClose from '../assets/work-03.png';

// These source screenshots contain a white perimeter and rounded lower corners.
// Trim only that perimeter in presentation; keep the source files intact.
export function hasCaptureEdge(image: ImageMetadata) {
 return image.src === ralphWide.src || image.src === ralphClose.src;
}
