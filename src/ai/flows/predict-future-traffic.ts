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
  output: {schema: PredictFutureTrafficOutputSchema},
  prompt: `You are a world-class railway traffic optimization expert. Analyze the provided station layout and live train statuses to predict future traffic conditions, anticipate potential conflicts, and estimate arrival times.

Station Layout:
{{stationLayout}}

Live Train Statuses:
{{liveTrainStatuses}}

Provide your output as a JSON string representing the predicted traffic conditions, including potential conflicts and estimated arrival times for each train.
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
