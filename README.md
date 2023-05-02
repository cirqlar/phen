This is a technical task featuring a landing page with a heatmap that can be used to compare the knockout effects of the top 10% list of genes from the IMPC Gene-Phenotype Associations dataset.

## How to run

To run locally: Clone the project, install dependencies and run the dev server

```bash
git clone https://github.com/cirqlar/phen.git

# In the project directory
npm install
npm run dev
```

Alternatively, a hosted version of this project can be found at [this website](https://phen.vercel.app/).

## Technology Decisions

- [Next.js](https://nextjs.org/) 13: chosen for it's incremental static regeneration (including the new app model using react server components and automatic caching) ao that data could be transformed on the server and that work only has to be done at build time.
- [Bootstrap](https://react-bootstrap.github.io/): As advised
- [Typescript](https://www.typescriptlang.org/): For the benefits of static type checking
- [Nivo](https://nivo.rocks/): It's easy to use and quick to get set up with and provides a lot of useful features.
- [React Select](https://react-select.com/home): Provides really nice UI & UX for the multiple select component (over the react bootstrap component)

## Design Decisions

- Transforming Data on the Server: This is work that would be repetitive so doing it on the server is best. Even better that since the results can be cached at build time and reused for all requests. It would also be relatively easy to deal with changing data if that became a requirement.
- Pagination: Nivo is quite performant but displaying a thousand rows at once is a bit much for performance (not to mention the bad user experience). Pagination was used along with filtering to keep this in check.

This task was implemented in a week (about 1 to 3 hours most days).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).