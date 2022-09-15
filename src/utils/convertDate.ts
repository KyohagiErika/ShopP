export default function ConvertDate(date: string) {

  let dateReplace = date.replace(/-/g, '/');
  let parts = dateReplace.split('/');
  let dateTrueFormat = `${parts[2]}/${parts[1]}/${parts[0]}`;

  return dateTrueFormat
}