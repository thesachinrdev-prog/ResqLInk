/**
 * Geospatial utility functions for distance, ETA, and coordinate interpolation
 */

// Calculate Haversine distance in kilometers between two lat/lng points
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Estimate emergency travel time in minutes based on average urban emergency speed (40 km/h)
export function estimateETA(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return '01 MIN';
  const averageEmergencySpeedKmH = 42; // siren speed in traffic
  const hours = distanceKm / averageEmergencySpeedKmH;
  const minutes = Math.max(1, Math.round(hours * 60));
  return `${String(minutes).padStart(2, '0')} MIN`;
}

// Linear interpolation between two coordinates
export function interpolateCoordinates(start, end, fraction) {
  if (!start || !end) return start;
  const lat = start.lat + (end.lat - start.lat) * fraction;
  const lng = start.lng + (end.lng - start.lng) * fraction;
  return { lat, lng };
}

export const interpolateCoords = interpolateCoordinates;

// Get human readable approximate street name for city center
export function getMockAddress(lat, lng) {
  const streets = [
    'Anna Nagar Main Road',
    'KK Nagar East 2nd Cross',
    'Simmakkal Circle',
    'Shenoy Nagar West',
    'Goripalayam Junction',
    'Lake View Road, K.K. Nagar',
    'Mattuthavani Ring Road',
    'Tallakulam Main Street',
  ];
  const index = Math.abs(Math.floor((lat + lng) * 100)) % streets.length;
  return `${streets[index]}, Madurai, Tamil Nadu`;
}
