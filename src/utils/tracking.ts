export function getAffiliateTid(): string | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('_fprom_tid='));
  return match ? match.split('=')[1] : null;
}
