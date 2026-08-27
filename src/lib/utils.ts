type classNames = string | undefined;

export function cn(...classes: classNames[]) {
  return classes.filter((x) => Boolean(x)).join(" ");
}
