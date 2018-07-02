// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  envName: 'dev',
  // NodeJS server SSO
  NODEJS_SERVER: 'localhost',
  NODEJS_PROTOCOL: 'http',
  NODEJS_PORT: 8080,

  // Micro services API
  MS_API_SERVER: 'uat.gateway.shiftleft.visa.com', // 10.72.226.29
  MS_API_PROTOCOL: 'https',
  MS_API_PORT: 8080,
  // non-prod: shiftleft.corpdev.visa.com
};
