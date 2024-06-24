# BOMA-ADMIN

## Build for Develpoment

### Node Version

v12.14.1

`> nvm install v20.9.0`
`> nvm use v20.9.0`

### Build Dependencies

`> nvm use v20.9.0 ` 
`> npm i`

### Run ember project 

`> ember s`

## Testing

`ember test --silent --reporter dot`

## Deploy to Staging

1.  Populate `.env.deploy.staging` from `.env.deploy.example`
1.  Make sure you are working from a clean stage (WARNING ember-deploy will deploy unstaged changes)
1.  Get the short hash of the current deployed version `ember deploy:list staging`
2.  Check diff `git diff {HASH}`
3.  If you're happy deploy `ember deploy staging --activate `

## Deploy to Production

1.  Populate `.env.deploy.production` from `.env.deploy.example`
1.  (WARNING ember-deploy will deploy unstaged changes)
1.  Get the short hash of the current deployed version `ember deploy:list production`
2.  Check diff `git diff {HASH}`
3.  If you're happy deploy `ember deploy production --activate `
