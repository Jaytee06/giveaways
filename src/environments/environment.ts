// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
    apiBaseUrl: 'http://localhost:4050',
  firebase: {
    apiKey: 'AIzaSyD1ZXXWToAvtsw9u-n0zH7gO-xJNgUTPB8',
    authDomain: 'giveaways-76aca.firebaseapp.com',
    databaseURL: 'https://giveaways-76aca.firebaseio.com',
    projectId: 'giveaways-76aca',
    storageBucket: 'giveaways-76aca.appspot.com',
    messagingSenderId: '674256843036'
  }
};
