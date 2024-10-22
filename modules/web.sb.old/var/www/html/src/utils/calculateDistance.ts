function calculateDistance(coordinate1: [number, number], coordinate2: [number, number]) {
  // Convert latitude and longitude from degrees to radians
  const radLat1 = (Math.PI / 180) * coordinate1[0];
  const radLon1 = (Math.PI / 180) * coordinate1[1];
  const radLat2 = (Math.PI / 180) * coordinate2[0];
  const radLon2 = (Math.PI / 180) * coordinate2[1];

  // Haversine formula
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of the Earth in kilometers (change to 3959 for miles)
  const radius = 6371;

  // Calculate the distance
  const distance = radius * c;

  return distance;
}

export default calculateDistance;