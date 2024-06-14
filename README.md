# Testing Instructions

## Getting Started

### Git Quickstart

```bash
  # Switching branches
  git checkout <BRANCH_NAME>
  git pull
```

### Running the application

```bash
npm install
npx prisma generate
npm run dev
```

### Opening the server

```bash
npx prisma studio
```

## Testing general instructions

1. When testing, make sure to watch for errors that show up while running the application. These errors will either pause the website and have a very obvious popup or there will be an error sign in the bottom left corner of the screen. Whenever these show up, take a screenshot and document steps to replicate the error. Be as specific as possible

2. Some testing will require running both the shop and the admin portal at the same time. In this case, make sure to confirm which branch must be tested in both repositories first.

3. If there is ever a need for clarification, DO NOT hesitate to ask for help.

## Testing cart logic

1. This will utilize the shop repository (Sweetbeasts) to test the cart logic
2. Run the application using the previous steps along with prisma studio
3. After receiving your new database secret, it is YOUR database to do whatever you would like with (for testing purposes) (Do not worry about having it contain the most up to date schema. ). So don't be scared to delete as needed.
4. Here is how the cart flow should work:

### UI Logic

1.  When a user is not logged in and they add a product to their cart, it should behave as normal.
2.  If a user then logs in with an account, the user's cart should be updated with the previous guest cart combined with the previous user cart.
3.  For example. User John Smith has 4 pogos in cart, but he is not logged in. Before he logs in, he adds a pogo to his cart as a guest. When he logs in, his cart should contain 5 pogos.
4.  Upon user logout, the cart should be empty

### Database logic and behavior

1. When a user is not logged in and they add a product to cart, a new `cartItem` should be created containing the item, quantity, and a guestId which is related to that person
2. When a user logs in, a few cases can occur:
   1. If the user already has a cart with the same item as the item currently in the guest cart. Ex: Non logged in user adds pogo but when the user was logged in, the user already had a pogo in their cart. The user's cart item should be updated with the quantity of the pogo they have in their cart plus what they had when they were logged in.
   2. If the user does not have a cart with the same item as the item currently in the guest cart. Ex: Non logged in user adds pogo but when the user was logged in, the user did not have a pogo in their cart. The user's cart item should be created with the quantity of the pogo they have in their cart plus what they had when they were logged in.
   3. IN BOTH CASES, THE GUEST CART SHOULD BE DELETED AFTER A USER LOGS IN
3. When a user logs out, the cart should be empty in the frontend but the cart should still be in the database.

Try and break the application and think of edge cases that could be tested. Document any issues you find with steps to replicate the issue.
