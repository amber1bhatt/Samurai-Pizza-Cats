# Samurai Pizza Cats

## Description
The cats got their paws into the code and started building a pretty basic menu management app for their pizza joint. It’s not great...it’s not even good. They are master pizza makers, not app makers, and thus have enlisted the help of the human hands. Having a thumb helps a lot when typing...

### Creating a Mongo database with basic CRUD operations
Unfortunately, the cats aren’t happy with the current selection and have started knocking some of the topping jars of the kitchen table. If we don't satisfy them with some cat-friendly toppings quickly, there will soon be nothing left. Let’s add some kitty treats to the database and remove the toppings that are now spoiled on the floor.

### Creating a React frontend page + API with GraphQL & Mongodb + Resolver & Provider testing
Be sure to take a close look at the topping provider and resolver. The cats would also like a way to manage their pizzas via a pizza management page perhaps?

### Creating Responsive design + Cursor-based Pagination
Cats vision is excellent, a little too excellent. Now that they’ve used the site for a bit, they realize, it’s pretty atrocious. It’s time to clean this site up so it’s presentable and clear.

## Video Demo

https://user-images.githubusercontent.com/43303850/186078048-7a4a5811-0497-4169-a86a-8b3cb1290a3c.mp4

## Running the code:

1. Run `yarn install:all` to install dependencies
1. Run `docker-compose up` to start a local mongo database instance in a docker container
1. Run `yarn seed:database` to seed your local database
1. Run `yarn start` in the root folder to start the client and server in parallel.

Note: Alternatively, you can run `yarn start` for the client and server in separate terminals

## Server Notes

- Every time you update the graphql schema, you will need to `yarn generate:types`

## Client Notes

- Watch the terminal for React warnings, and ensure they are fixed before putting up your pull request

### Troubleshooting

If you are on linux you may get the following error: `Error: ENOSPC: System limit for number of file watchers reached`

#### Solution:

Modify the number of system monitoring files

1. Edit your `sysctl.conf` with `sudo gedit /etc/sysctl.conf`
2. Add the following line at to the bottom `fs.inotify.max_user_watches=524288` then save and exit
3. Verify this changed worked with `sudo sysctl -p`
