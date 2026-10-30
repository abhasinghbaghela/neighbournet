import { Incident } from '../types';

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Tokenizes and normalizes text for word frequency similarity.
 */
function tokenizeText(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'near', 'by',
    'very', 'there', 'of', 'for', 'with', 'to', 'from', 'it', 'this', 'that',
    'है', 'में', 'पर', 'और', 'से', 'को', 'का', 'के', 'की'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  return new Set(words);
}

/**
 * Computes Jaccard Similarity between two text descriptions.
 */
export function computeTextSimilarity(text1: string, text2: string): number {
  const set1 = tokenizeText(text1);
  const set2 = tokenizeText(text2);
  if (set1.size === 0 || set2.size === 0) return 0;

  let intersectionCount = 0;
  for (const word of set1) {
    if (set2.has(word)) intersectionCount++;
  }

  const unionCount = set1.size + set2.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  confidence: 'high' | 'medium' | 'low' | 'none';
  matchScore: number; // 0 to 100
  matchedIncident?: Incident;
  distanceMeters: number;
  reasons: string[];
}

/**
 * Evaluates whether a new or candidate report is a duplicate of an existing report.
 */
export function detectDuplicate(
  candidate: {
    category: string;
    description: string;
    lat: number;
    lng: number;
    createdAt?: string;
  },
  existingIncident: Incident
): DuplicateDetectionResult {
  // 1. Distance score (500 meters threshold max)
  const distance = calculateDistanceMeters(
    candidate.lat,
    candidate.lng,
    existingIncident.location.lat,
    existingIncident.location.lng
  );

  let proximityScore = 0;
  if (distance <= 50) {
    proximityScore = 1.0;
  } else if (distance <= 250) {
    proximityScore = 1.0 - (distance - 50) / 250;
  } else if (distance <= 500) {
    proximityScore = 0.2 - ((distance - 250) / 250) * 0.2;
  } else {
    proximityScore = 0;
  }

  // 2. Category Match
  let categoryScore = 0;
  if (candidate.category === existingIncident.category) {
    categoryScore = 1.0;
  } else if (
    (candidate.category.includes('Road') && existingIncident.category.includes('Civic')) ||
    (candidate.category.includes('Water') && existingIncident.category.includes('Civic'))
  ) {
    categoryScore = 0.5;
  }

  // 3. Text Similarity
  const textScore = computeTextSimilarity(candidate.description, existingIncident.description);

  // 4. Temporal Proximity (within 48 hours)
  const candidateTime = candidate.createdAt ? new Date(candidate.createdAt).getTime() : Date.now();
  const existingTime = new Date(existingIncident.createdAt).getTime();
  const diffHours = Math.abs(candidateTime - existingTime) / (1000 * 60 * 60);

  let timeScore = 1.0;
  if (diffHours <= 6) timeScore = 1.0;
  else if (diffHours <= 24) timeScore = 0.8;
  else if (diffHours <= 48) timeScore = 0.5;
  else if (diffHours <= 96) timeScore = 0.2;
  else timeScore = 0.05;

  // Composite Weighted Score
  // If incidents are farther than 600m, they can't be duplicates of local hazards
  if (distance > 600) {
    return {
      isDuplicate: false,
      confidence: 'none',
      matchScore: 0,
      distanceMeters: distance,
      reasons: ['Locations are too far apart for hyperlocal clustering.']
    };
  }

  const rawScore =
    proximityScore * 0.40 +
    categoryScore * 0.25 +
    textScore * 0.25 +
    timeScore * 0.10;

  const scorePercentage = Math.round(rawScore * 100);
  const reasons: string[] = [];

  if (distance <= 150) reasons.push(`Close proximity: only ${distance}m away`);
  if (categoryScore === 1.0) reasons.push(`Identical category: ${candidate.category}`);
  if (textScore > 0.3) reasons.push(`Semantic description overlap (${Math.round(textScore * 100)}%)`);
  if (diffHours < 24) reasons.push(`Reported within ${Math.round(diffHours)} hours`);

  if (scorePercentage >= 70 && distance <= 250) {
    return {
      isDuplicate: true,
      confidence: 'high',
      matchScore: scorePercentage,
      matchedIncident: existingIncident,
      distanceMeters: distance,
      reasons
    };
  } else if (scorePercentage >= 50 && distance <= 350) {
    return {
      isDuplicate: true,
      confidence: 'medium',
      matchScore: scorePercentage,
      matchedIncident: existingIncident,
      distanceMeters: distance,
      reasons
    };
  } else {
    return {
      isDuplicate: false,
      confidence: 'low',
      matchScore: scorePercentage,
      matchedIncident: existingIncident,
      distanceMeters: distance,
      reasons: reasons.length ? reasons : ['Insufficient similarity']
    };
  }
}

/**
 * Searches across all active incidents to find potential duplicate candidates.
 */
export function findPotentialDuplicates(
  candidate: {
    category: string;
    description: string;
    lat: number;
    lng: number;
    createdAt?: string;
  },
  incidents: Incident[]
): DuplicateDetectionResult[] {
  return incidents
    .filter(inc => inc.status !== 'Resolved')
    .map(inc => detectDuplicate(candidate, inc))
    .filter(res => res.matchScore >= 45)
    .sort((a, b) => b.matchScore - a.matchScore);
}
