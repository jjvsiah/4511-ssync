export const staticUsers = [
  {
    id: 1,
    name: "John",
    email: "john@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/100?img=1",
    projects: [
      {
        id: 1,
        projectName: "Website Redesign",
        description: "Redesigning company website",
        tasks: [
          {
            id: 1,
            title: "Create low fidelity prototype",
            description: "Initial wireframes for homepage",
            platform: "figma",
            priority: "High",
            date: "10 Jan",
            time: "14:30",
            assignees: [
              {
                id: 1,
                name: "John",
                avatar: "https://i.pravatar.cc/100?img=1",
              },
              {
                id: 2,
                name: "Jane",
                avatar: "https://i.pravatar.cc/100?img=2",
              },
            ],
            subtasks: [
              { id: 1, title: "Homepage layout", isComplete: true },
              { id: 2, title: "Navigation design", isComplete: false },
              { id: 3, title: "Mobile responsive", isComplete: false },
            ],
            isComplete: false,
            progress: 33,
          },
          {
            id: 2,
            title: "Push changes for launch page",
            description: "Update repository with new changes",
            platform: "github",
            priority: "Medium",
            date: "7 Feb",
            time: "16:00",
            assignees: [
              {
                id: 1,
                name: "John",
                avatar: "https://i.pravatar.cc/100?img=1",
              },
            ],
            subtasks: [
              { id: 1, title: "Code review", isComplete: false },
              { id: 2, title: "Fix bugs", isComplete: false },
            ],
            isComplete: false,
            progress: 0,
          },
          {
            id: 3,
            type: "poll",
            title: "Design System Preferences",
            options: [
              { id: 1, text: "Material Design" },
              { id: 2, text: "Custom Design System" },
              { id: 3, text: "Tailwind CSS" },
            ],
          },
          {
            id: 4,
            type: "poll",
            title: "Sprint Planning Day",
            options: [
              { id: 1, text: "Monday" },
              { id: 2, text: "Wednesday" },
              { id: 3, text: "Friday" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    avatar: "https://i.pravatar.cc/100?img=2",
    projects: [
      {
        id: 2,
        projectName: "Mobile App",
        description: "Developing new mobile application",
        tasks: [
          {
            id: 3,
            title: "Weekly Standup",
            description: "Team sync meeting",
            platform: "teams",
            priority: "Medium",
            date: "Tuesdays",
            time: "14:30",
            assignees: [
              {
                id: 2,
                name: "Jane",
                avatar: "https://i.pravatar.cc/100?img=2",
              },
              {
                id: 3,
                name: "Mike",
                avatar: "https://i.pravatar.cc/100?img=3",
              },
            ],
            subtasks: [],
            isComplete: false,
            progress: 0,
          },
          {
            id: 5,
            type: "poll",
            title: "Tech Stack Selection",
            options: [
              { id: 1, text: "React Native" },
              { id: 2, text: "Flutter" },
              { id: 3, text: "Native (iOS/Android)" },
            ],
          },
        ],
      },
    ],
  },
];

// Store initial data in AsyncStorage
export const initializeData = async () => {
  try {
    await AsyncStorage.setItem("users", JSON.stringify(staticUsers));
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};
