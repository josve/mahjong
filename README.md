# Run locally


First time you checkout you need to run this command, you also need to run it if you or someone else have added dependencies or upgraded depdendencies.

```
npm install
```

To run the local server you use

```
npm run dev
```

Note however that this way of running the system is not as strict as running it in production build so it might be the case that you can run it this way but not when building for production. There are GitHub actions setup so that when you create a branch the system will run it in production build mode to ensure that it will work. You can also run the same command locally.

```
nmp run build
```

# Update DB

First make sure you have installed db-migrate.

In the root folder run

```
npm install db-migrate
npm install db-migrate-mysql
```

Make sure you have a .env file (copy .env.local if needed) with your DB credentials added (don't commit it, it is in gitignore)

Then you can run it later using

```
node node_modules/db-migrate/bin/db-migrate
```

To update the DB with the latest schema changes run

```
node node_modules/db-migrate/bin/db-migrate up
```

# Testing loging

First add a row to the Player matching the PLAYER_ID with the EMAIL that you want to use to login.

Then you need to enable to very unsecure settings in your .env file.
DEV_MOCK_PWD=password to use to login
DEV_ALLOW_INSECURE_EMAIL=true

This should obviously not be enabled in any production system but nice for quick testing.

