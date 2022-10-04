# ℹ️ Introduction

### Expected duration: **1h** ~ **1h30**

### How to submit the exercice ?

**1.** Create your repo by using this repository as a template.

<img width="750" alt="Screenshot 2022-08-02 at 20 46 19" src="https://user-images.githubusercontent.com/20050165/182450543-33f96cf9-81f7-425f-93ce-0ca26568128d.png">

**2.** Code the exercice.

**3.** When you are done, send the link of your repository to your interviewer, while making sure he/she can access it.

# ✋ Before you get started

### Required tech stack

In order to run the project, there is a couple of technologies you need to install to your device.

- [Node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) and [Mongo Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation/)
- Redis
- Npm or [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- Typescript

### Environment variables

You'll need to set the following variables

ℹ️ You can directly past the variables below in a file called `.env.development.local` inside the folder back

```text
# PORT
PORT = 3002

# DATABASE
DB_HOST = localhost
DB_PORT = 27017
DB_DATABASE = dev

# CACHE
REDIS_URL = 'redis://localhost:6379/1'

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```

### How to run the Project ?

- Install both `front/` and `back/` packages using ➝ `npm install` or `yarn i`
- Start back `npm run dev` or `yarn dev`
- Start front `npm run web` or `yarn web`

**Everything should now run smoothly, you are all set !**

# 📝 Brief

Using an external API you’ll need to fetch data then save it in a collection, each entry need to be processed as a job in a queue. Fetching this data need to be done at a scheduled period.

Just like in real business environments, the `front/` and `back/` folders already have a base structure, written code, and packages. Find your way around the project, but feel free to add what you might find useful to complete the task.

# ☑️ Tasks

## Back-end

### Requirements

> :warning: The code needs to be written in Typescript !

- Using the API from [vélib-metropole-opendata](https://www.velib-metropole.fr/donnees-open-data-gbfs-du-service-velib-metropole) you’ll need to fetch the stations status
- For each station create a job that will save the fetched informations
- The stations status need to be updated regularly (each X ms ~ hours)
- The jobs need to be processed in a queue (use [bullmq](https://github.com/taskforcesh/bullmq))
- Once the stations are saved, create an API that will be used in the front side to display them

## Front-end

> :warning: The code needs to be written in Typescript and use [react-native-web](https://necolas.github.io/react-native-web/) components. All components should be functional and their props typed.

### Requirements

- Using the created API from the back display a simple table or list of the stations (you can use front components libraries like material or bootstrap)

---

### All **informations** about this exercise should have been provided in this README, but if you have any questions, feel free to contact us!
