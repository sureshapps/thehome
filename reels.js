/* =====================================================================
   REELS DATA LAYER
   Hand-curated reels for the Reels page. These are merged in script.js
   with every "video" type post from the 50-post feed (data.js), so any
   reel added here automatically shows up in the swipeable Reels page
   and the Profile > Reels tab.
===================================================================== */

const REELS = [
    {
        src: 'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/10111197-hd_720_1280_60fps.mp4',
        user: 'creative.dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        caption: 'Motion study \u2014 lighting & texture practice \ud83c\udfa5',
        audio: 'Original audio \u00b7 creative.dev',
        likes: '24.8K',
        comments: '312',
        poster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=700&fit=crop'
    },
    {
        src: 'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/11920773_1080_1920_30fps.mp4',
        user: 'studio.frames',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        caption: 'Behind the scenes of today\u2019s shoot \u2728',
        audio: 'Original audio \u00b7 studio.frames',
        likes: '18.2K',
        comments: '204',
        poster: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=700&fit=crop'
    },
    {
        src: 'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/13685085_1440_2560_30fps.mp4',
        user: 'design.lab',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
        caption: 'Color grading pass #2, what do you think? \ud83c\udfa8',
        audio: 'Original audio \u00b7 design.lab',
        likes: '31.5K',
        comments: '487',
        poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=700&fit=crop'
    },
    {
        src: 'https://pub-d47b202e5190468fa52e1340d54d71b4.r2.dev/16929615-sd_360_640_30fps.mp4',
        user: 'pixel.craft',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        caption: 'Quick loop I made this weekend \ud83d\udd01',
        audio: 'Original audio \u00b7 pixel.craft',
        likes: '9.6K',
        comments: '96',
        poster: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=700&fit=crop'
    }
];

window.REELS = REELS;
