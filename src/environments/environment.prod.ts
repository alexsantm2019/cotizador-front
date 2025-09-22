import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://localhost:4200',
  whiteLogo: 'assets/images/logos/logo-white.png',
  mainLogo: 'assets/images/logos/logo.png'
};
