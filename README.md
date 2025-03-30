# Early Bird

## Inspiration

As students with ADHD ourselves, we've experienced the all-too-familiar cycle of procrastination and last-minute panic. The traditional approach of deadline-driven motivation doesn't work for everyone, especially those with executive functioning challenges. We wanted to create a solution that flips the script—incentivizing starting early rather than just meeting deadlines. By gamifying the process of getting ahead on assignments, we aim to help students with ADHD develop better habits while making productivity fun.

## What it does

Early Bird is a productivity app that rewards students for starting and completing assignments ahead of schedule. Here's how it works:

- Students add assignments with start dates and deadlines using an API
- Our algorithm calculates potential QuackCoins based on how early they complete tasks
- The earlier you finish, the more coins you earn (up to 50% bonus for first-quarter completion)
- A cute animated duck waddles across your progress bar to visually track completion
- A leaderboard lets friends compete in a healthy way based on early completion rates
- Progress statistics help visualize improvements in time management

The app transforms the stress of deadlines into the joy of early progress, making productivity feel like a game rather than a chore.

## How we built it

We built Early Bird using a modern full-stack approach:

- **Frontend**: Next.js with TailwindCSS for responsive, accessible design
- **Backend**: Flask API with SQLAlchemy for data handling
- **Authentication**: Magic link email-based authentication for seamless login
- **Database**: SQLite for development (PostgreSQL for production)
- **Deployment**: AWS for backend, Vercel for frontend
- **State Management**: React Context API for user data and authentication
- **Animations**: Custom CSS animations for our duck character

We focused on creating a clean, accessible UI with both light and dark mode support to accommodate different sensory preferences. The animated duck character adds personality and visual feedback to progress tracking.

## Challenges we ran into

Building Early Bird presented several technical challenges:

1. **Authentication Flow**: Implementing secure magic link authentication required careful error handling and retry mechanisms
2. **State Management**: Ensuring user data persistently updated across components, especially coins after completing assignments
3. **Dark Mode Toggle**: Creating a seamless theme switching experience with persistent preferences
4. **API Integration**: Transitioning from mock data to real API calls while maintaining a smooth user experience

The most challenging aspect was ensuring a consistent and responsive user experience across different devices and scenarios, especially with intermittent network connectivity.

## Accomplishments that we're proud of

We're particularly proud of:

- Creating an algorithm that fairly rewards early completion rather than just deadline compliance
- Designing an adorable duck character animation that celebrates progress
- Building an accessible application with proper ARIA attributes and keyboard navigation
- Implementing a robust authentication system with magic links
- Crafting a clean, intuitive interface that makes task management enjoyable

Most importantly, we built a tool that we genuinely want to use ourselves—one that transforms the academic experience for students with ADHD by making early starts rewarding.

## What we learned

This project taught us valuable lessons in both technology and user experience:

- The importance of proper error handling in applications with authentication
- How to effectively use React hooks and context for state management
- Techniques for building accessible interfaces from the ground up
- The power of small animations and rewards for user engagement
- The nuances of designing for neurodivergent users with unique needs

We also learned that gamification can be a powerful motivator when aligned with genuinely helpful behavior changes, not just engagement for its own sake.

## What's next for Early Birds

We have exciting plans for the future of Early Bird:

1. **Course Integration**: Connect with popular learning management systems like Canvas to automatically import assignments
2. **Advanced Analytics**: Provide deeper insights into productivity patterns and suggest optimal work times
3. **Study Groups**: Allow users to form study groups and collaborate on shared assignments
4. **Customizable Duck Characters**: Let users personalize their progress companion using Quackcoins
5. **Mobile App**: Develop native mobile applications for on-the-go progress tracking
6. **Smart Notifications**: Implement AI-powered notifications that adapt to each user's work habits

Our ultimate goal is to create a comprehensive productivity ecosystem that meets the unique needs of students with ADHD and other executive functioning challenges, helping them build lasting habits that extend beyond academia into their careers.

Team Members: Sara Cheakdkaipejchara, Shasha Alvares, Vaibhav Achuthananda
