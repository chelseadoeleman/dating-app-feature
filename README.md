# dating-app-feature
**Feature for a dating application. The main learning goal for this project is rendering your code server-side with node and express. Where data will be stored/retrieved in a NoSQL database (MonogDB) and renderd with an templating engine.**

![Application](./docs/littls.png)
> Home page where are the profiles will be shown.

## Table of Contents
* **[How to install](#how-to-install)**
* **[Concept](#concept)**
* **[Data model](#data-model)**
* **[Process](#process)**
* **[Resources](#resources)**
* **[Credits](#credits)**
* **[License](#license)**

## How to install

Before installing make sure you have installed node.js and npm.
Choose or make a new directory.
Load the template into your directory.

```bash
git clone https://github.com/chelseadoeleman/dating-app-feature.git
```

Make sure you are in the right directory 
```bash
cd dating-app-feature
```

Check if you have the latest version of npm.
Install the dependencies in [package.json](./package.json)
```bash
npm install
```
To run the script 
```bash
npm run start
```
or if you're using nodemon
```bash
npm run start-server
```

## Concept

**Job Story**
*When* I see a person. *I want to* know a little more about them. *So I can* decide whether to like or dislike them.

In my application you can browse through user profiles and like or dislike them. When that other person likes you back, you will get a match! 
> Not not working in the application yet, because right now you have a default user profile

When you have a match a page will be renderd with all your matches, so you can schedule an appointment to go on a walk together with your beloved dogs. 

## Data model

```json
{
    "name": "String",
    "age": "Number",
    "location": "String",
    "characteristics": "String",
    "bio": "String",
    "instagram": "String",
    "measurements": "String",
    "images": "Array",
    "matches": "Array"
}

```
> This is how the data model looks right now. When you have a match their ID will be pushed into your matches Array. 

```json
{
    "name": "String",
    "age": "Number",
    "location": "String",
    "characteristics": "String",
    "bio": "String",
    "instagram": "String",
    "measurements": "String",
    "images": "Array",
    "matches": "Array",
    "unanswered": "Array"
}

```

> This is kinda how the data model looks should look when you are able to log in. The people you like will be stored in unanswered, until they like or dislike you back. In case of a dislike, their Id will be removed. In case of a like their Id will be stored in matches.


## Proces
I started off with creating a Job Story specificaly for a dating application. Then I created a simple styleguide and some simple designs. 

For **backend** specifically I started off, by creating a data model to get a gist of how the application should work and what data I needed. Then I roughly sketched out the functions and their functions. During this period I had already build my server with Express and used EJS as an templating engine. 

Then came the hardest part which was setting up the database and connecting it to my application. Luckily this went quite alright, however rendering queries to the database and storing and retrieving data was a whole 'nother story. Luckily the internet was very helpful in this case. 
> Still having a minor problem where the server logs: ```Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters``` While I do realise the problem it's hard to tell where it's comming from and how to fix it. Apparantly ObjectID(id) is not in the right format, however after multiple logs I still do not find an issue. 

In express-session I stored a fake userId to create a 'logged in account' without having to actualy login. Here all the matches are stored. I also stored the matches to render in ```/matches```, because these can't be viewed, when the user is not logged in. However they are properly stored in the database.

## Resources
**Packages**
* [Node JS](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Express session](https://www.npmjs.com/package/express-session)
* [Ejs](https://ejs.co/)
* [Bodyparser](https://www.npmjs.com/package/body-parser)
* [Slug](https://www.npmjs.com/package/slug)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [MongoDB](https://www.mongodb.com/)
* [Nodemon](https://nodemon.io/)

**Other resources**
* [Update an Array](https://docs.mongodb.com/manual/reference/operator/update-array/)

## Credits

## License
This repository is licensed as [MIT](LICENSE) by [Chelsea Doeleman](https://github.com/chelseadoeleman)