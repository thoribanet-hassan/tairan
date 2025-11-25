export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    city: string;
    code: string;
    time: string;
  };
  arrival: {
    city: string;
    code: string;
    time: string;
  };
  price: number;
  duration: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: {
    time: string;
    description: string;
    location?: string;
  }[];
}

export interface Itinerary {
  destination: string;
  duration: string;
  summary: string;
  days: ItineraryDay[];
}

// Mock interface for travel provider requests
export interface SearchParams {
  origin?: string;
  destination: string;
  date: string;
  travelers: number;
}