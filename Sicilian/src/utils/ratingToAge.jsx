export const ratingToAge = rated => {
  switch (rated) {
    case "G":
      return 0; // All ages
    case "PG":
      return 7; // 7 år
    case "PG-13":
      return 13; // 13 år
    case "R":
      return 17; // 17 år
    case "NC-17":
      return 18; // 18 år
    case "N/A":
      return 0; // Ingen åldersgräns
    case "TV-G":
      return 0; // All ages (TV)
    case "TV-PG":
      return 7; // Föräldrar rekommenderas (TV)
    case "TV-14":
      return 14; // 14 år (TV)
    case "TV-MA":
      return 17; // Endast vuxna (17+)
    default:
      return 100; // Default: superhög ålder så vi inte visar okända ratings av misstag
  }
};
