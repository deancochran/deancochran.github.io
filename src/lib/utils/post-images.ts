// WebP is both the interoperable fallback and the only non-AVIF output, keeping
// the server and client builds on one shared fallback asset set.
import aiDraft from '$lib/assets/post-images/ai-draft-not-my-work-to-finish.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import bookReview from '$lib/assets/post-images/designing-ml-systems-book-review.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import dotfiles from '$lib/assets/post-images/dotfiles-header.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import ftmsExerciseBikes from '$lib/assets/post-images/ftms-exercise-bikes.jpg?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import logo from '$lib/assets/post-images/logo.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import machineLearning from '$lib/assets/post-images/machine-learning-on-the-edge-with-sveltekit-and-tensorflowjs.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import svelteSummit from '$lib/assets/post-images/svelte-summit-fall-2024.webp?enhanced&format=avif;webp&w=1600;1200;900;640;480'
import type { Picture } from '@sveltejs/enhanced-img'

interface PostImage {
    source: Picture
    alt?: string
}

const postImages: Record<string, PostImage> = {
    '/images/ai-draft-not-my-work-to-finish.webp': {
        source: aiDraft,
        alt: 'Weathered red stop sign in a sunlit grassy field, with distant mountains under a blue sky',
    },
    '/images/designing-ml-systems-book-review.webp': {
        source: bookReview,
    },
    '/images/dotfiles-header.webp': { source: dotfiles },
    '/images/ftms-exercise-bikes.jpg': {
        source: ftmsExerciseBikes,
        alt: 'Monochrome indoor exercise bikes in a gym',
    },
    '/images/logo.webp': { source: logo },
    '/images/machine-learning-on-the-edge-with-sveltekit-and-tensorflowjs.webp':
        {
            source: machineLearning,
        },
    '/images/svelte-summit-fall-2024.webp': { source: svelteSummit },
}

export function getPostImage(image: string) {
    const postImage = postImages[image]
    if (!postImage) {
        // Frontmatter is evaluated while prerendering, so missing registry coverage
        // fails the build instead of silently serving an unoptimized image.
        throw new Error(`No enhanced image registered for post image: ${image}`)
    }

    return postImage
}
