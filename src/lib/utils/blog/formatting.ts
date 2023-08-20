type DateStyle = Intl.DateTimeFormatOptions["dateStyle"];

export function formatDate(
  date: string,
  dateStyle: DateStyle = "medium",
  locales = "en"
) {
  const formatter = new Intl.DateTimeFormat(locales, { dateStyle });
  return formatter.format(new Date(date));
}

export function getImgPath(path = "/profile.jpeg") {
  const STATIC_IMG_CLOUDFRONT_URL = "https://d2q0psfc0y231i.cloudfront.net";
  const res = `${STATIC_IMG_CLOUDFRONT_URL}${path}`;
  return res;
}

export function shortenText(
  val: string,
  limit: number | undefined = undefined
) {
  if (limit) {
    if (val.length > limit) {
      return val.slice(0, limit - 1) + "...";
    } else {
      return val;
    }
  } else {
    return val;
  }
}
