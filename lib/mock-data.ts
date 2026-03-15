export interface User {
  id: string
  username: string
  avatar: string
  hasStory?: boolean
}

export interface Comment {
  id: string
  user: User
  text: string
  timestamp: string
  likes: number
}

export interface Post {
  id: string
  user: User
  image: string
  caption: string
  likes: number
  comments: Comment[]
  timestamp: string
  isLiked?: boolean
  isSaved?: boolean
}

export const currentUser: User = {
  id: "user-0",
  username: "your_story",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces",
  hasStory: false,
}

export const users: User[] = [
  {
    id: "user-1",
    username: "emma_travels",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-2",
    username: "alex_photo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-3",
    username: "sarah.designs",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-4",
    username: "mike_runs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-5",
    username: "lily.cooks",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-6",
    username: "david_music",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-7",
    username: "nina.art",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
  {
    id: "user-8",
    username: "chris_fit",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=faces",
    hasStory: true,
  },
]

export const posts: Post[] = [
  {
    id: "post-1",
    user: users[0],
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
    caption: "Exploring new horizons ✨ #travel #adventure #wanderlust",
    likes: 1243,
    timestamp: "2 hours ago",
    comments: [
      {
        id: "c1",
        user: users[1],
        text: "This is absolutely stunning! Where was this taken?",
        timestamp: "1h",
        likes: 12,
      },
      {
        id: "c2",
        user: users[2],
        text: "Adding this to my bucket list! 🌟",
        timestamp: "45m",
        likes: 5,
      },
      {
        id: "c3",
        user: users[3],
        text: "The colors are incredible!",
        timestamp: "30m",
        likes: 3,
      },
    ],
  },
  {
    id: "post-2",
    user: users[1],
    image: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=600&h=600&fit=crop",
    caption: "Golden hour magic 🌅 There's something special about this time of day.",
    likes: 892,
    timestamp: "4 hours ago",
    comments: [
      {
        id: "c4",
        user: users[0],
        text: "Perfect lighting! 📸",
        timestamp: "3h",
        likes: 8,
      },
      {
        id: "c5",
        user: users[4],
        text: "This is so peaceful 💛",
        timestamp: "2h",
        likes: 4,
      },
    ],
  },
  {
    id: "post-3",
    user: users[2],
    image: "https://images.unsplash.com/photo-1682686581498-5e85c7228c9d?w=600&h=600&fit=crop",
    caption: "Architecture appreciation post 🏛️ The details in this building are incredible.",
    likes: 567,
    timestamp: "6 hours ago",
    comments: [
      {
        id: "c6",
        user: users[5],
        text: "Love the symmetry!",
        timestamp: "5h",
        likes: 6,
      },
    ],
  },
  {
    id: "post-4",
    user: users[3],
    image: "https://images.unsplash.com/photo-1682687219640-b3f11f4b7234?w=600&h=600&fit=crop",
    caption: "Morning coffee and creativity ☕ Starting the day right with some design inspiration.",
    likes: 1567,
    timestamp: "8 hours ago",
    comments: [
      {
        id: "c7",
        user: users[6],
        text: "Need this energy!",
        timestamp: "7h",
        likes: 15,
      },
      {
        id: "c8",
        user: users[7],
        text: "What coffee are you drinking?",
        timestamp: "6h",
        likes: 2,
      },
    ],
  },
  {
    id: "post-5",
    user: users[4],
    image: "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=600&h=600&fit=crop",
    caption: "Weekend vibes 🌿 Taking time to relax and recharge.",
    likes: 734,
    timestamp: "12 hours ago",
    comments: [
      {
        id: "c9",
        user: users[0],
        text: "This looks so relaxing!",
        timestamp: "11h",
        likes: 9,
      },
    ],
  },
  {
    id: "post-6",
    user: users[5],
    image: "https://images.unsplash.com/photo-1682686581362-7c34b7ca2d1b?w=600&h=600&fit=crop",
    caption: "Music is the answer 🎵 New tracks coming soon!",
    likes: 2103,
    timestamp: "1 day ago",
    comments: [
      {
        id: "c10",
        user: users[1],
        text: "Can't wait to hear it!",
        timestamp: "23h",
        likes: 20,
      },
      {
        id: "c11",
        user: users[3],
        text: "🔥🔥🔥",
        timestamp: "20h",
        likes: 11,
      },
    ],
  },
]

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id)
}
