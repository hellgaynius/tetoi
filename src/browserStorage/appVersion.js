import packageJSON from '../../package.json';

export default function checkAppVersion() {
  const localeStorageVersion = localStorage.getItem('version');

  if (!(localeStorageVersion && localeStorageVersion === packageJSON.version)) {
    localStorage.clear()
    localStorage.setItem('version', packageJSON.version);

    window.location.reload();
  }
}
