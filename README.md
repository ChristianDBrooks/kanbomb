# KanBomb

Kanbomb is a simple kanban style task board application, allowing users to create persistant boards, with unlimited named lists and tasks. This app was built specifcally by me Christian Brooks, to demonstrate the extense of my experience in React, Design principles, Data Flow & Architecture, Schema Architecture, and Application Development. I used a starter kit that I built myself in the NextJS framework. The features I built into the starter kit include:
* Material UI
* Material Icons
* Prisma
* Prisma DBML Generator [Visualize the schema.dbml](https://dbdiagram.io/d)
* Iron Session Authentication
  - Persistant Users
  - Magic Link Login
* SWR Fetching
* SendGrid
* Stripe
* PWA Enabled
However I added to this to build out the KanBomb application.

Note: This app is not completed, and is not a fully polished app, but rather was built in a couple of nights of development to have a portfolio project I can show to hiring managers, since most of my work is not publicly available to show.

# Future Development

 - Deleting tasks from a list.
 - User can create multiple boards.
 - User can modify board title.
 - User can delete boards.

# Needs Improvement
 - Unit Tests
 - Complete database error handling.
 - Complete client side request handling.
 - The way we are currently synchronizing tasklists requires a loop for n number of tasks, and a lot of heavyhanded data updates. Not performant in the long term, but works for a proof of concept. We would want to make each update more granular allowing for more precise and performant updates. This currently is more of a "catch all" update.