# Live Link List

## About the Project

This web application utilizes ReactJS, Django, Django Rest Framework, and PostgreSQL to allow users to post and browse links and basic information about live-streams being hosted on various social media applications. Users can choose to sign up for a user account to be able to manage the links they post, or they can post without a user account. The goal of the web app was for it to be simple, quick, and easy to use.

If a user wants to browse live-streams they can go to the browse page and search listings based on hashtags attached to the live-stream post, the username of the account hosting the live-stream, and the social media platform the live-stream is occuring on.

## Live URL

This app is deployed through Heroku and Netlify and can be accessed at:
https://livelinklist.com/

## Getting Started - Backend

### Installing Dependencies

#### Python 3.9

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Poetry Dependencies

This project was built using poetry for the virtual environment. All of the project dependencies are stored in the `pyproject.toml` file. Install dependencies by navigating to the `/backend` directory and running:

```bash
poetry install
```

This will install all of the required packages within the `pyproject.toml` file.

#### Envrionment Variables

##### Dotenv Database Variables

This app uses the following environment variables from a `.env` file that you will need to populate with your own local values:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:<port>/<database_name>

DJANGO_DEBUG
DJANGO_SECRET_KEY
DJANGO_SETTINGS_MODULE

SENDGRID_API_KEY
SENDGRID_SANDBOX

REDIS_HOST_URL
REDIS_HOST_PORT
REDIS_HOST_PASSWORD"
```

## Getting Started - Frontend

### Installing Dependencies

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

#### Installing Project Dependencies

This project uses yarn to manage software dependencies. Yarn relies on the package.json file located in the `frontend` directory of this repository. To install dependencies run:

```bash
yarn install
```

### Building App for Production `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Running the Frontend in Dev Mode

The frontend app was built using create-react-app. In order to run the app in development mode use `npm start` or `yarn start`.

The frontend app will run on [http://localhost:3000](http://localhost:3000). You will need to ensure that the Django backend is running on port 8000 in order to fetch necessary data.<br>

```bash
yarn start
```

## Running the Server

From within the `./backend` directory, first make sure you are connected to your systems PostgreSQL database servers. Then run the Django server by executing:

```bash
poetry run python manage.py runserver
```

## API Behavior

### Endpoints

GET, POST, PATCH, DELETE '/lives',  
GET, POST, PATCH, DELETE '/platforms',  
GET, POST, PATCH, DELETE '/hashtags',  
GET, POST, PATCH, DELETE '/users',

POST '/log-in',  
POST '/log-out',  
POST '/refresh-token',  
POST '/send-confirm-email',  
POST '/confirm-email',  
POST '/password-reset',  
POST '/password-reset-confirmed',

## Authorization

This app utilizes JWT Authentication with refresh and access tokens through the third party library `djangorestframework-simplejwt`. User permissions are set up through Django Rest Framework tools.
