interface Array<T> {
  remove(element: T): Array<T>;
}

export function removeFromArray<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element, 0);
  if (index > -1) {
    return array.splice(index, 1);
  }
  return array;
}
