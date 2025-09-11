// This file handles the integration with the live RailRadar API.
import { trainData as mockTrainData } from '@/lib/data';

export interface LiveTrainStatus {
  id: string; // train_number
  name: string; // train_name
  type: string; // Pulled from a static mapping or another API call if needed
  status: string; // A descriptive status like "Approaching", "Departed", "Halted"
  last_location: string; // last_location
  destination: string; // final_destination for the train
  expected_time: string; // eta / etd
  delay_minutes: number; // delay
  platform_number: string; // platform_number
  event_type: 'ARRIVAL' | 'DEPARTURE'; // event_type
  length_coaches: number; // Requires static data lookup
}

const RAILRADAR_API_BASE_URL = 'https://api.railradar.com/v1'; // Fictional URL

// A mapping to get coach length. In a real app, this might be another API call.
const trainLengthMap: { [key: string]: number } = {
  "12417": 24, "12002": 18, "04408": 12, "FREIGHT-01": 60,
  "12951": 22, "22435": 16, "12302": 22,
};


// Helper to determine a clear, descriptive status
const getDescriptiveStatus = (apiTrain: any, stationCode: string): string => {
    if (apiTrain.event_type === 'DEPARTURE' && apiTrain.last_location.includes(stationCode)) {
        return `Departed ${stationCode}`;
    }
    if (apiTrain.event_type === 'ARRIVAL' && apiTrain.last_location.includes(stationCode)) {
        return `Halted at P-${apiTrain.platform_number}`;
    }
    if (apiTrain.event_type === 'ARRIVAL') {
        return `Approaching from ${apiTrain.last_location}`;
    }
    return `En route to ${apiTrain.final_destination || 'destination'}`;
}


// Helper to transform the fictional API response to our app's data structure
const transformApiResponse = (apiTrain: any, stationCode: string): LiveTrainStatus => {
  return {
    id: apiTrain.train_number,
    name: apiTrain.train_name,
    type: 'Express', // Placeholder, would need more data for accuracy
    status: getDescriptiveStatus(apiTrain, stationCode),
    last_location: apiTrain.last_location,
    destination: apiTrain.final_destination || `P-${apiTrain.platform_number}`,
    expected_time: apiTrain.expected_time,
    delay_minutes: apiTrain.delay_minutes,
    platform_number: apiTrain.platform_number,
    event_type: apiTrain.event_type,
    length_coaches: trainLengthMap[apiTrain.train_number] || 18, // Default length
  };
};


/**
 * Fetches the live board information for a specific station.
 * 
 * @param stationCode The code for the station (e.g., "NDLS").
 * @returns A promise that resolves to an array of live train statuses.
 */
export async function getLiveStationStatus(stationCode: string): Promise<LiveTrainStatus[]> {
  const apiKey = process.env.NEXT_PUBLIC_RAILRADAR_API_KEY;
  if (!apiKey) {
    console.warn("RailRadar API key is not configured. Falling back to mock data.");
    // Using mock data as a fallback for development if the key isn't set
    return Promise.resolve(mockTrainData.map(train => ({
      id: train.id,
      name: train.name,
      type: train.type,
      status: train.status,
      last_location: train.location,
      destination: train.destination,
      expected_time: train.eta,
      delay_minutes: train.status === 'Delayed' ? 15 : 0, // Mock delay
      platform_number: train.destination.split('-')[1] || 'N/A',
      event_type: train.eta === 'N/A' ? 'DEPARTURE' : 'ARRIVAL',
      length_coaches: train.length_coaches,
    })));
  }

  try {
    // This is a MOCKED fetch call. It simulates the API response structure.
    // In a real scenario, you would uncomment the actual fetch call.
    console.log(`Fetching live data for station: ${stationCode}...`);
    // const response = await fetch(`${RAILRADAR_API_BASE_URL}/stations/${stationCode}/live`, {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
    // const data = await response.json();
    // return data.trains.map(transformApiResponse);

    // MOCK RESPONSE SIMULATION
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay
    const mockApiResponse = {
      trains: [
        { train_number: '12417', train_name: 'Prayagraj Express', event_type: 'ARRIVAL', expected_time: '07:00', delay_minutes: 0, platform_number: '3', last_location: 'Ghaziabad Jn.', final_destination: 'NDLS' },
        { train_number: '12002', train_name: 'Shatabdi Express', event_type: 'ARRIVAL', expected_time: '07:25', delay_minutes: 10, platform_number: '1', last_location: 'Sonipat', final_destination: 'NDLS' },
        { train_number: '04408', train_name: 'NZM-GZB MEMU', event_type: 'ARRIVAL', expected_time: '07:05', delay_minutes: 0, platform_number: '12', last_location: 'Anand Vihar', final_destination: 'NDLS' },
        { train_number: '12951', train_name: 'Mumbai Rajdhani', event_type: 'DEPARTURE', expected_time: '08:30', delay_minutes: 0, platform_number: '2', last_location: 'NDLS', final_destination: 'MMCT' },
        { train_number: '22435', train_name: 'Vande Bharat', event_type: 'DEPARTURE', expected_time: '06:00', delay_minutes: 0, platform_number: '16', last_location: 'NDLS', final_destination: 'BSB' },
      ]
    };
    return mockApiResponse.trains.map(apiTrain => transformApiResponse(apiTrain, stationCode));

  } catch (error) {
    console.error("Failed to fetch live station status:", error);
    return []; // Return an empty array on failure
  }
}
