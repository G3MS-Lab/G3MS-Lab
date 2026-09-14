---
title: "E-Learning for Health"
academicYear: 2024
students:
  - Tanapat Cherdmanusatian
  - Sirivarakul Jiropakarn
advisor: Taweechai Nuntawisuttiwong
reportUrl: "https://drive.google.com/example"
---

Lack of knowledge about health and wellbeing, combined with the fragmentation of information from sources
such as social media, government officials, and news remains a significant obstacle among Thai citizens.
To address this issue, we propose the solution of an online learning platform that provides a wide range
of educational media. We aim to make it easier to research and learn health-related topics by organizing
information in one place and also to give users more personalized learning experience through interactive
tools like quizzes, assessments, and progress tracking to support their learning journey.
The application includes two websites. The main website for learners to access content and services. The back
office for authorized staff to manage content on the platform. These are built using the AstroJS framework
and Go REST API server. SQLite is used as the database, and media files are handled through MinIO. Lastly,
Redis is a caching storage for JWT tokens.
The platform is deployed on a virtual machine and includes all the key features such as a learning section,
blogs, banners, and authentication. The back office website provides a wide range of management operations
including creation, edition, deletion, and retrieval of contents of the application such as learning materials,
blogs, banners, and users. We implemented a custom JWT access and refresh token system that provides
robust security and allows for tailored security configurations. However, due to cookie’s port isolation limitation, JWT tokens are shared between the main and back office websites, making it impossible for a user and
an admin to remain active on their respective platforms simultaneously. In the future, the application can be
expanded to include discussion forums, events, and jobs features, offering users more options to cater to their
specific needs.
