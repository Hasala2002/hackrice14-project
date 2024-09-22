![Cyberswift Logo](https://i.postimg.cc/MT8GW2d1/Screenshot-2024-09-22-041830.png)

## Setup

**Setup locally**

> First clone the repo as shown below.

    $ git clone https://github.com/Hasala2002/hackrice14-project

> And then go into the directory;

    $ cd hackrice14-project

> Install dev dependencies with Yarn or NPM, I recommend Yarn. Do this in both the frontend and backend folders separately

    $ yarn install
    //or
    $ npm install

**Start Server**

    $ yarn run dev
    //or
    $ npm run dev

> Go to http://localhost:5173 to view the local deploy. Edit and save files, then refresh to reload updates.

## Inspiration

We were inspired by the lack of engaging learning management systems (LMS) in today's digital education landscape. Traditional LMS platforms often feel static and uninspired, lacking the interactive elements necessary to keep students truly engaged. Our vision evolved when we discovered Gather.town, a 2D virtual environment used for company meetings. We thought, “What if we could adapt this concept to create a **2D RPG-style gamification virtual environment for education?**” This idea led us to develop Cyberswift—a unique blend of education and gamification where students can explore virtual classrooms, interact with peers and instructors, and complete assignments in an immersive way.

## What it does

Cyberswift transforms the online learning experience by creating a virtual space where education meets adventure. Built using 2D RPG-style graphics, the platform allows students to move through a virtual environment that mirrors a physical campus. They can attend live-streamed classes, submit assignments, collaborate with fellow students, and interact with a mentor chatbot powered by OpenAI for personalized assistance. We’ve made learning interactive and fun while maintaining the core functionalities of an LMS—tracking progress, managing assignments, and enhancing engagement.

To keep in theme of an RPG game, all elements such as the live classroom and assignments view will popup when a students walks towards the designated position in the game map. For example, if the player goes up to a computer, it will load the live classroom broadcast

## How we built it

Cyberswift’s frontend was developed using React and Three.js, giving it a responsive and visually immersive environment. The backend was powered by Node.js and Websockets, providing real-time interactions such as live-streaming. We integrated Auth0 for secure authentication, and MongoDB to store and manage student data and assignments efficiently. Additionally, we leveraged the OpenAI API to create a mentor chatbot, designed to assist students by answering questions and providing learning resources. The Websockets allowed us to create a real-time livestreaming platform for conducting online classes, bringing teachers and students together in a dynamic learning space.

### Front End

- React
- Three.JS
- Framer Motion
- Auth0

### Back End

- Node.JS
- EJS
- Express
- MongoDB
- OpenAI
- Socket.IO

## Challenges we ran into

Working under tight deadlines brought several technical challenges. One of the biggest hurdles was handling _CORS (Cross-Origin Resource Sharing) issues_ while developing the platform locally, making it difficult to connect our backend services to the frontend. Optimizing the performance of the livestreaming feature was another tough challenge, as we encountered latency issues, affecting the speed and efficiency of the streaming service. Despite these hurdles, we were able to implement core functionalities like authentication, live streaming, and the mentor chatbot, which we’re particularly proud of.

## Accomplishments that we're proud of

Our biggest achievement is the successful integration of a real-time live-streaming platform and authentication system using Auth0, which ensures that users can securely access their virtual classrooms. We’re also proud of building the mentor chatbot that leverages the OpenAI API, offering a personal assistant for students who need extra guidance. These features have the potential to significantly improve how online education is conducted, blending both security and accessibility into one seamless experience. The fact that we could achieve these features makes it all the more rewarding for our experience as students.

## What we learned

Throughout this project, we learned the importance of troubleshooting and debugging code under tight time constraints. Finding workarounds for CORS issues and improving the performance of real-time features, like streaming, taught us a lot about optimizing workflows. We also gained valuable experience using third-party services like Auth0 for authentication and MongoDB for database management. These tools helped us understand how to implement advanced functionality quickly and securely, without sacrificing user experience. Additionally, we learned how to efficiently manage APIs, allowing us to integrate external services into our system smoothly.

## What's next for Cyberswift

Our next steps for Cyberswift include refining the user experience for both students and teachers. We plan to optimize the live-streaming feature to reduce latency and improve efficiency, ensuring that classes run smoothly in real time. We’re also working on expanding the capabilities of the mentor chatbot, allowing it to offer more personalized guidance and real-time feedback for students. Another future goal is to enhance the gamified elements, introducing more quests and rewards to further incentivize student engagement. We aim to integrate AI-based analytics to track and predict student performance, offering insights to both teachers and students for personalized improvement. Additionally, we hope to expand the platform to support a wider range of subjects and interactive tools.
