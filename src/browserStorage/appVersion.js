import packageJSON from '../../package.json';

export default function checkAppVersion() {
  const localStorageVersion = localStorage.getItem('version');

  if (!(localStorageVersion && localStorageVersion === packageJSON.version)) {
    localStorage.clear()
    localStorage.setItem('version', packageJSON.version);

    window.location.reload();
  }
}
