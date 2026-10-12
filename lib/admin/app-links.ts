// The Flutter web app uses Flutter's default hash URL strategy (no
// usePathUrlStrategy call in the app), so its routes live after "#".
const APP_BASE_URL = 'https://app.tatulogue.com';

export function appProfileUrl(userId: string): string {
  return `${APP_BASE_URL}/#/profile/${encodeURIComponent(userId)}`;
}
