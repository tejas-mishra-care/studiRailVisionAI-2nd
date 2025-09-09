'use server';

/**
 * @fileOverview A flow to predict future traffic conditions, anticipate potential conflicts, and estimate arrival times.
 *
 * - predictFutureTraffic - A function that handles the prediction of future traffic.
 * - PredictFutureTrafficInput - The input type for the predictFutureTraffic function.
 * - PredictFutureTrafficOutput - The return type for the predictFutureTraffic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureTrafficInputSchema = z.object({
  stationLayout: z.string().describe('A JSON string representing the static station layout data.'),
  liveTrainStatuses: z.string().describe('A JSON string representing the dynamic live train statuses.'),
});
export type PredictFutureTrafficInput = z.infer<typeof PredictFutureTrafficInputSchema>;

const PredictFutureTrafficOutputSchema = z.object({
  predictedTrafficConditions: z.string().describe('A JSON string representing the predicted traffic conditions, including potential conflicts and estimated arrival times.'),
});
export type PredictFutureTrafficOutput = z.infer<typeof PredictFutureTrafficOutputSchema>;

export async function predictFutureTraffic(input: PredictFutureTrafficInput): Promise<PredictFutureTrafficOutput> {
  return predictFutureTrafficFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureTrafficPrompt',
  input: {schema: PredictFutureTrafficInputSchema},
  output: {schema: z.object({
    conflicts: z.array(z.object({
      type: z.string().describe("Type of conflict, e.g., 'Crossing', 'Platform', 'Head-on'"),
      severity: z.string().describe("Severity of the conflict, e.g., 'Low', 'Medium', 'High'"),
      time: z.string().describe("Estimated time of conflict, e.g., '10:52'"),
      description: z.string().describe("A human-readable description of the conflict."),
    })),
    estimatedArrivals: z.array(z.object({
      trainId: z.string().describe("The ID of the train."),
      newEta: z.string().describe("The new estimated time of arrival."),
      reason: z.string().describe("Reason for the change in ETA."),
    })),
  }).transform(val => ({ predictedTrafficConditions: JSON.stringify(val) }))},
  prompt: `You are a world-class railway traffic optimization expert. Analyze the provided station layout and live train statuses to predict future traffic conditions, anticipate potential conflicts, and estimate arrival times.

Station Layout:
{{{stationLayout}}}

Live Train Statuses:
{{{liveTrainStatuses}}}

Based on the data, predict potential conflicts and estimate new arrival times for trains that might be affected.
Provide your output as a JSON object with 'conflicts' and 'estimatedArrivals' keys.
`,
});

const predictFutureTrafficFlow = ai.defineFlow(
  {
    name: 'predictFutureTrafficFlow',
    inputSchema: PredictFutureTrafficInputSchema,
    outputSchema: PredictFutureTrafficOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
