# Big Papa Pizza

GitHub + Netlify ready version of the Big Papa Pizza ordering app.

## What this version includes

- Mobile-friendly pizza ordering app
- Real menu images
- Collection / Delivery ordering
- Cart and quantity controls
- Customer details and order notes
- Secure Stripe Checkout
- Card payments
- Apple Pay where Stripe/device eligibility allows it
- Payment success page
- Server-side price validation
- Stripe webhook endpoint for confirmed paid orders
- Netlify Functions

## 1. Create a GitHub repository

On GitHub:

1. Tap **+** → **New repository**
2. Repository name: `big-papa-pizza`
3. Choose **Private** if you do not want the source code public
4. Do not add a README, .gitignore, or licence because they are already included here
5. Create the repository

## 2. Upload this project to GitHub

Unzip the downloaded project first.

In the empty GitHub repository:

1. Choose **uploading an existing file**
2. Upload the CONTENTS of this folder, not another folder wrapped around it
3. Make sure these are visible at the top level:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `package.json`
   - `netlify.toml`
   - `netlify/functions/`
4. Commit the files

## 3. Connect the GitHub repository to Netlify

In Netlify:

1. **Add new project**
2. **Import an existing project**
3. Choose **GitHub**
4. Select the `big-papa-pizza` repository
5. Netlify should read `netlify.toml` automatically
6. Publish directory: `.`
7. Functions directory: `netlify/functions`
8. Deploy

## 4. Add Stripe test key

In Netlify:

**Project configuration → Environment variables**

Create:

`STRIPE_SECRET_KEY`

Use your real Stripe TEST secret key as the value. It starts with:

`sk_test_`

Do not paste your secret key into GitHub or into any source file.

After adding it, create a new deploy.

## 5. Test payments

Open the Netlify website and make an order.

When you tap **Continue to secure payment**, Stripe Checkout should open.

Start with Stripe test mode.

## 6. Add the Stripe webhook

Once the site is working, create this webhook in Stripe:

`https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/stripe-webhook`

Listen for:

`checkout.session.completed`

Stripe will give you a webhook signing secret starting with:

`whsec_`

Add that to Netlify as:

`STRIPE_WEBHOOK_SECRET`

Then deploy again.

## Important

Do not put these into GitHub:

- Stripe secret keys
- Stripe webhook secrets
- Any live payment credentials

They belong only in Netlify Environment Variables.

## Current sample menu prices

- Margarita — £9.95
- Pepperoni — £10.95
- Pepperoni Crumble — £10.95
- Pepper-Honey — £11.95
- Hot Honey — £10.95
- Big Papas Fully Loaded — £13.95

The same prices are defined server-side in:
`netlify/functions/create-checkout-session.js`

That prevents a customer from editing the browser price before paying.
