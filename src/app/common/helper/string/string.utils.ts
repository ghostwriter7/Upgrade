export function snakeToTitleCase(value: string): string {
  return value
    .split('_')
    .filter((word) => word.length)
    .map((word) => word.at(0)?.toUpperCase() + word.slice(1))
    .join(' ');
}
