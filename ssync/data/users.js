export const staticUsers = [
  {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/100?img=1',
    selectedProject: 1,
    projects: [
      {
        id: 1,
        projectCode: 'hymr3s',
        projectName: 'Website Redesign',
        description: 'Redesigning company website',
        users: [
          {
            name: 'John',
            tasksCompleted: 4,
            profileIcon: 'https://i.pravatar.cc/100?img=1',
          },
          {
            name: 'Jane Smith',
            tasksCompleted: 6,
            profileIcon: 'https://i.pravatar.cc/100?img=2',
          },
        ],
        posts: [
          {
            id: 1,
            postName: 'Initial Thoughts on Design',
            content:
              'Hello team! I just wanted to check in and see if we could maybe have another in-person meeting this upcoming Thursday to discuss the project specification more in-depth?',
            dateTime: '2024-11-15T14:30:00',
            posterName: 'John',
            posterEmail: 'john@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=1',
          },
          {
            id: 2,
            postName: 'UI Review Meeting',
            content:
              'Hey, I wanted to update you guys with the news that I have finished off our Iteration 1! We are now off to iteration 2.',
            dateTime: '2024-11-17T10:00:00',
            posterName: 'Jane Smith',
            posterEmail: 'jane@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=2',
          },
          {
            id: 3,
            postName: 'Project Update - Iteration 2',
            content:
              'Hey everyone, I’ve started on Iteration 2 and will be focusing on integrating the new features we discussed last week. Please feel free to drop any suggestions here.',
            dateTime: '2024-11-11T09:00:00',
            posterName: 'John',
            posterEmail: 'john@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=1',
          },
          {
            id: 4,
            postName: 'Finalizing Project Specification',
            content:
              'I’ve gone through the latest spec draft, and I think we’re almost ready to finalize. Let’s aim to have everything wrapped up by Friday.',
            dateTime: '2024-10-19T16:00:00',
            posterName: 'Jane Smith',
            posterEmail: 'jane@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=2',
          },
          {
            id: 5,
            postName: 'Discussion on Task Assignment',
            content:
              'Can someone help clarify the task assignments for the upcoming sprint? I believe I need to take the lead on the front-end work.',
            dateTime: '2024-09-20T12:30:00',
            posterName: 'John',
            posterEmail: 'john@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=1',
          },
          {
            id: 6,
            postName: 'Prototype Feedback Session',
            content:
              'We’ll be having a feedback session for the latest prototype at 2 PM today. Make sure to review the latest version before joining.',
            dateTime: '2023-02-21T14:00:00',
            posterName: 'Jane Smith',
            posterEmail: 'jane@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=2',
          },
        ],
        tasks: [
          {
            id: 1,
            title: 'Create low fidelity prototype',
            description: 'Initial wireframes for homepage',
            platform: 'figma',
            priority: 'High',
            date: '10 Jan',
            time: '14:30',
            assignees: [
              {
                id: 1,
                name: 'John',
                avatar: 'https://i.pravatar.cc/100?img=1',
              },
              {
                id: 2,
                name: 'Jane',
                avatar: 'https://i.pravatar.cc/100?img=2',
              },
            ],
            subtasks: [
              { id: 1, title: 'Homepage layout', isComplete: true },
              { id: 2, title: 'Navigation design', isComplete: false },
              { id: 3, title: 'Mobile responsive', isComplete: false },
            ],
            isComplete: false,
            progress: 33,
          },
          {
            id: 2,
            title: 'Push changes for launch page',
            description: 'Update repository with new changes',
            platform: 'github',
            priority: 'Medium',
            date: '7 Feb',
            time: '16:00',
            assignees: [
              {
                id: 1,
                name: 'John',
                avatar: 'https://i.pravatar.cc/100?img=1',
              },
            ],
            subtasks: [
              { id: 1, title: 'Code review', isComplete: false },
              { id: 2, title: 'Fix bugs', isComplete: false },
            ],
            isComplete: false,
            progress: 0,
          },
        ],
      },
      {
        id: 2,
        projectName: 'Mobile App',
        description: 'Developing new mobile application',
        projectCode: 'pik2m3',
        users: [
          {
            name: 'Mike',
            tasksCompleted: 3,
            profileIcon: 'https://i.pravatar.cc/100?img=3',
          },
          {
            name: 'Jane Smith',
            tasksCompleted: 5,
            profileIcon: 'https://i.pravatar.cc/100?img=2',
          },
          {
            name: 'John',
            tasksCompleted: 4,
            profileIcon: 'https://i.pravatar.cc/100?img=1',
          },
        ],
        posts: [
          {
            id: 1,
            postName: 'User Flow Discussion',
            content: 'Discussing the new user flow design.',
            dateTime: '2024-10-17T12:30:00',
            posterName: 'Mike',
            posterEmail: 'mike@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=3',
          },
        ],
        tasks: [
          {
            id: 3,
            title: 'Weekly Standup',
            description: 'Team sync meeting',
            platform: 'teams',
            priority: 'Medium',
            date: 'Tuesdays',
            time: '14:30',
            assignees: [
              {
                id: 2,
                name: 'Jane',
                avatar: 'https://i.pravatar.cc/100?img=2',
              },
              {
                id: 3,
                name: 'Mike',
                avatar: 'https://i.pravatar.cc/100?img=3',
              },
            ],
            subtasks: [],
            isComplete: false,
            progress: 0,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
    avatar: 'https://i.pravatar.cc/100?img=2',
    selectedProject: 2,
    projects: [
      {
        id: 2,
        projectName: 'Mobile App',
        description: 'Developing new mobile application',
        projectCode: 'pik2m3',
        posts: [
          {
            id: 1,
            postName: 'User Flow Discussion',
            content: 'Discussing the new user flow design.',
            dateTime: '2024-10-17T12:30:00',
            posterName: 'Mike',
            posterEmail: 'mike@example.com',
            profileIcon: 'https://i.pravatar.cc/100?img=3',
          },
        ],
        tasks: [
          {
            id: 3,
            title: 'Weekly Standup',
            description: 'Team sync meeting',
            platform: 'teams',
            priority: 'Medium',
            date: 'Tuesdays',
            time: '14:30',
            assignees: [
              {
                id: 2,
                name: 'Jane',
                avatar: 'https://i.pravatar.cc/100?img=2',
              },
              {
                id: 3,
                name: 'Mike',
                avatar: 'https://i.pravatar.cc/100?img=3',
              },
            ],
            subtasks: [],
            isComplete: false,
            progress: 0,
          },
        ],
      },
    ],
  },
];

// Store initial data in AsyncStorage
export const initializeData = async () => {
  try {
    await AsyncStorage.setItem('users', JSON.stringify(staticUsers));
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};
