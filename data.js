/* =====================================================================
   POST DATA LAYER
   Generates the 50 unified feed posts (photo / video / website / post),
   plus the 20 "Tagged" blog-style posts, shared by Home, Search, and
   Profile so every surface reads from one source of truth.
===================================================================== */

const IMG_IDS = [
    'photo-1555066931-4365d14bab8c', 'photo-1550751827-4bd374c3f58b',
    'photo-1518770660439-4636190af475', 'photo-1573164713988-8665fc963095',
    'photo-1504384308090-c894fdcc538d', 'photo-1531482615713-2afd69097998',
    'photo-1618005182384-a83a8bd57fbe', 'photo-1542909168-82c3e7fdca5c',
    'photo-1677442136019-21780ecad995', 'photo-1560472355-536de3962603',
    'photo-1519389950473-47ba0277781c', 'photo-1498050108023-c5249f4df085',
    'photo-1461749280684-dccba630e2f6', 'photo-1607799279861-4dd421887fb3',
    'photo-1522542550221-31fd19575a2d', 'photo-1487058792275-0ad4aaf24ca7',
    'photo-1517694712202-14dd9538aa97', 'photo-1550439062-609e1531270e',
    'photo-1517180102446-f3ece451e9d8', 'photo-1571171637578-41bc2dd41cd2'
];
const img = (id, w, h) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

const VIDEO_SRCS = [
    'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/10111197-hd_720_1280_60fps.mp4',
    'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/11920773_1080_1920_30fps.mp4',
    'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/13685085_1440_2560_30fps.mp4',
    'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/16929615-sd_360_640_30fps.mp4'
];

const HASHTAG_POOL = [
    'design', 'webdev', 'ui', 'ux', 'react', 'ai', 'travel', 'nature',
    'coding', 'creative', 'animation', 'branding', 'threedee', 'photography',
    'startup', 'tech', 'minimal', 'darkmode', 'gradient', 'opensource',
    'frontend', 'javascript', 'figma', 'motion', 'portfolio'
];

const USERNAMES = [
    'creative.dev', 'pixel.craft', 'studio.frames', 'design.lab', 'nightcoder',
    'ai.labs', 'motion.hub', 'byte.forge', 'glassmorph', 'ux.nomad',
    'render.farm', 'grid.theory'
];

const AVATARS = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
];

const WEBSITE_PROJECTS = [
    { title: 'Glassmorphism UI Kit', desc: 'A comprehensive design system built with glassmorphism principles. 40+ reusable components.', tags: ['React', 'TypeScript', 'Figma', 'Tailwind'] },
    { title: 'AI Creative Studio', desc: 'Generate stunning visuals with AI. Integrated with multiple image generation APIs.', tags: ['Next.js', 'Node.js', 'GraphQL', 'AI'] },
    { title: 'Motion Portfolio', desc: 'Award-winning personal portfolio with physics-based animations, custom WebGL effects.', tags: ['React', 'Framer', 'WebGL', 'GSAP'] },
    { title: 'Dev Dashboard', desc: 'Real-time developer productivity dashboard. Track GitHub activity, code metrics.', tags: ['TypeScript', 'Node.js', 'WebSocket', 'Charts'] },
    { title: 'Nomad Booking App', desc: 'Full-stack booking platform for remote workspaces with live availability sync.', tags: ['Next.js', 'Stripe', 'Postgres'] },
    { title: 'Signal Analytics', desc: 'Marketing analytics suite with cohort breakdowns and predictive churn scoring.', tags: ['Vue', 'Python', 'D3.js'] },
    { title: 'Aperture Gallery', desc: 'A minimal, blazing-fast photography portfolio generator for creatives.', tags: ['Astro', 'Cloudflare', 'Image CDN'] },
    { title: 'Loopstation', desc: 'Browser-based audio loop sequencer for quick musical sketches.', tags: ['Web Audio API', 'Canvas', 'JS'] },
    { title: 'Terra Map Kit', desc: 'Customizable interactive map components for travel and logistics apps.', tags: ['MapLibre', 'React', 'GeoJSON'] },
    { title: 'Formulate', desc: 'Drag-and-drop form builder with conditional logic and native validation.', tags: ['React', 'Zustand', 'Zod'] },
    { title: 'Kanban Flow', desc: 'Realtime collaborative kanban board with presence indicators.', tags: ['Next.js', 'WebSocket', 'Redis'] },
    { title: 'Palette Forge', desc: 'AI-assisted color palette generator tuned for accessible contrast ratios.', tags: ['AI', 'Tailwind', 'WCAG'] },
    { title: 'Storywall', desc: 'A CMS-free way to publish long-form visual stories straight from Figma.', tags: ['Figma API', 'Next.js'] }
];

const TEXT_POSTS = [
    'Shipped a redesign today. The best interfaces are the ones nobody notices — they just work.',
    'Spent the morning debugging a race condition. Found it. Fixed it. Small wins matter.',
    'Design tip: whitespace is not empty space, it\'s a decision. Use it on purpose.',
    'Three cups of coffee and a component library later — the design system finally clicks together.',
    'Reminder to self: ship the imperfect version. You can always iterate in public.',
    'The gradient took longer than the layout. Worth every minute.',
    'Refactored 2,000 lines down to 400. Deleting code is still my favorite kind of progress.',
    'Client called the prototype "exactly what we didn\'t know we wanted." Best kind of feedback.',
    'Dark mode isn\'t a palette swap, it\'s a whole new set of contrast decisions.',
    'Sketching wireframes on paper again. Sometimes the fastest tool is the analog one.',
    'Micro-interactions are the seasoning of a product. A little goes a long way.',
    'Today\'s mood: naming variables like they\'ll outlive me.',
    'Every "quick fix" is a promise to your future self that you probably won\'t keep. Do it right.'
];

function pickHashtags(seed, n) {
    const tags = [];
    let i = seed;
    while (tags.length < n) {
        const tag = HASHTAG_POOL[i % HASHTAG_POOL.length];
        if (!tags.includes(tag)) tags.push(tag);
        i += 7;
    }
    return tags;
}

function seededLikes(seed, base) {
    return Math.round(base + (seed * 137) % 900) / 10;
}

function generatePosts(count) {
    const posts = [];
    for (let i = 0; i < count; i++) {
        const type = ['photo', 'video', 'website', 'post'][i % 4];
        const id = `post-${i}`;
        const username = USERNAMES[i % USERNAMES.length];
        const avatar = AVATARS[i % AVATARS.length];
        const hashtags = pickHashtags(i, 2 + (i % 3));
        const likes = seededLikes(i, 12);
        const base = {
            id, type, username, avatar, hashtags,
            likes: `${likes}K`,
            comments: 30 + (i * 13) % 400,
            date: new Date(2026, 5, 1 + (i % 28)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        if (type === 'photo') {
            const imgId = IMG_IDS[i % IMG_IDS.length];
            posts.push({
                ...base,
                image: img(imgId, 800, 900),
                thumb: img(imgId, 400, 400),
                caption: `A closer look at the details \u2014 this one\u2019s all about texture and light. ${hashtags.map(h => '#' + h).join(' ')}`
            });
        } else if (type === 'video') {
            const src = VIDEO_SRCS[i % VIDEO_SRCS.length];
            const poster = img(IMG_IDS[(i + 3) % IMG_IDS.length], 800, 900);
            posts.push({
                ...base,
                videoSrc: src,
                thumb: poster,
                isReel: true,
                caption: `Behind the scenes clip \u2014 process over polish. ${hashtags.map(h => '#' + h).join(' ')}`
            });
        } else if (type === 'website') {
            const proj = WEBSITE_PROJECTS[i % WEBSITE_PROJECTS.length];
            posts.push({
                ...base,
                title: proj.title,
                desc: proj.desc,
                tags: proj.tags,
                thumb: img(IMG_IDS[(i + 6) % IMG_IDS.length], 600, 400),
                stars: Math.round((seededLikes(i, 3) * 100)),
                demoUrl: 'https://example.com/' + proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                githubUrl: 'https://github.com/creative-dev/' + proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                caption: `New project live: ${proj.title}. ${hashtags.map(h => '#' + h).join(' ')}`
            });
        } else {
            posts.push({
                ...base,
                text: TEXT_POSTS[i % TEXT_POSTS.length],
                thumb: null,
                gradient: [
                    'linear-gradient(135deg,#f59e0b,#ec4899)',
                    'linear-gradient(135deg,#8b5cf6,#3b82f6)',
                    'linear-gradient(135deg,#10b981,#3b82f6)',
                    'linear-gradient(135deg,#ec4899,#6366f1)',
                    'linear-gradient(135deg,#f43f5e,#f59e0b)'
                ][i % 5]
            });
        }
    }
    return posts;
}

const TAGGED_TITLES = [
    'Designing for Trust: A Case Study', 'From Wireframe to Ship in 6 Days',
    'The Small Details That Make Big UI', 'Why We Rebuilt Our Design Tokens',
    'A Year of Building in Public', 'Motion Systems, Not Just Animations',
    'What Breaks First at 10x Scale', 'Color Theory for Dark Interfaces',
    'Prototyping With Real Data', 'The Cost of a Missing Empty State',
    'Typography Choices Nobody Notices', 'Behind the AI Studio Launch',
    'Refactoring a Design System Live', 'Notes From a Failed Redesign',
    'Making Onboarding Disappear', 'Accessibility Isn\u2019t Optional',
    'The Grid That Holds Everything Together', 'Shipping Fast Without Breaking Trust',
    'Why Whitespace Is a Feature', 'Building a Brand From One Gradient'
];

function generateTaggedPosts(count) {
    const posts = [];
    for (let i = 0; i < count; i++) {
        const hashtags = pickHashtags(i + 5, 3);
        const mediaCount = 2 + (i % 3);
        const media = [];
        for (let m = 0; m < mediaCount; m++) {
            const mType = ['photo', 'video', 'link'][(i + m) % 3];
            if (mType === 'photo') {
                media.push({ type: 'photo', src: img(IMG_IDS[(i + m) % IMG_IDS.length], 700, 500) });
            } else if (mType === 'video') {
                media.push({ type: 'video', src: VIDEO_SRCS[(i + m) % VIDEO_SRCS.length], poster: img(IMG_IDS[(i + m + 2) % IMG_IDS.length], 700, 500) });
            } else {
                media.push({ type: 'link', url: 'https://example.com/article-' + (i + 1), label: 'Read the full case study' });
            }
        }
        posts.push({
            id: `tagged-${i}`,
            coverThumb: img(IMG_IDS[i % IMG_IDS.length], 500, 500),
            title: TAGGED_TITLES[i % TAGGED_TITLES.length],
            subtitle: 'Field notes from a working designer-developer',
            mediaText: 'A quick look at the process, the missteps, and what finally worked.',
            description: 'This post walks through the reasoning behind the decision, what the constraints were, and how the outcome was measured. It\u2019s less about the final screenshot and more about the trade-offs made to get there \u2014 the parts that usually don\u2019t make it into a portfolio.',
            date: new Date(2026, (i % 12), 3 + (i % 25)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            hashtags,
            media
        });
    }
    return posts;
}

window.POSTS = generatePosts(50);
window.TAGGED_POSTS = generateTaggedPosts(20);