'use server';

/**
 * @fileOverview An AI agent to generate safe and efficient action plans for rail traffic.
 *
 * - optimizeTrainRoutes - A function that orchestrates the route optimization process.
 * - OptimizeTrainRoutesInput - The input type for the optimizeTrainRoutes function.
 * - OptimizeTrainRoutesOutput - The return type for the optimizeTrainRoutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeTrainRoutesInputSchema = z.object({
  stationLayout: z.string().describe('JSON representation of the railway station layout, including nodes, tracks, and signals.'),
  liveTrainStatuses: z.string().describe('JSON representation of the current status of all trains, including location, destination, ETA, and delay.'),
  trackRestrictions: z.string().optional().describe('JSON representation of any track restrictions, such as maintenance blocks.'),
  trainSchedules: z.string().optional().describe('JSON representation of the train schedules, including planned stops and timings.'),
  trainPriorities: z.string().optional().describe('JSON representation of the train priorities, to ensure important trains are given precedence.'),
  manualOverride: z.string().optional().describe('A plain-text instruction from the human controller that must be factored into the plan, overriding other constraints if necessary.'),
});
export type OptimizeTrainRoutesInput = z.infer<typeof OptimizeTrainRoutesInputSchema>;

const OptimizeTrainRoutesOutputSchema = z.array(z.object({
  train_id: z.string(),
  action: z.enum(['ASSIGN', 'HOLD', 'PROCEED']),
  target_node: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  reasoning: z.string(),
}));
export type OptimizeTrainRoutesOutput = z.infer<typeof OptimizeTrainRoutesOutputSchema>;

export async function optimizeTrainRoutes(input: OptimizeTrainRoutesInput): Promise<OptimizeTrainRoutesOutput> {
  return optimizeTrainRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeTrainRoutesPrompt',
  input: {schema: OptimizeTrainRoutesInputSchema},
  output: {
    schema: OptimizeTrainRoutesOutputSchema
  },
  prompt: `You are SAARATHI, a world-class railway traffic optimization expert for Indian Railways. Your sole task is to generate a safe, conflict-free, and optimized schedule for the provided station layout and live train statuses. You must think step-by-step and adhere strictly to all rules and output formats.

## CRITICAL OVERRIDE INSTRUCTION FROM HUMAN CONTROLLER ##
This is the most important instruction. You MUST adhere to it above all other rules if it conflicts with them.
"{{{manualOverride}}}"

## CONTEXT DATA ##

# STATION LAYOUT AND RULES (Static):
{{{stationLayout}}}

# LIVE TRAIN STATUSES (Dynamic):
{{{liveTrainStatuses}}}

# TRACK RESTRICTIONS:
{{{trackRestrictions}}}

# TRAIN SCHEDULES:
{{{trainSchedules}}}

# TRAIN PRIORITIES:
{{{trainPriorities}}}

## UNBREAKABLE RULES ##
1. **SAFETY FIRST:** A single track segment cannot be occupied by more than one train at the same time.
2. **PLATFORM FIT:** A train can only be assigned to a platform if the train's length is less than or equal to the platform's length. The length of trains are specified by length_coaches field in the train data. One coach is 25 meters long.
3. **SCHEDULED HALTS:** You MUST include any scheduled halts for each train as specified in its data. The train must remain at the halt platform for the full duration. These are specified in the scheduled_halts field. The field is specified in the JSON format. For example:  [{"station": "HIJ", "platform": 2, "duration": 5}] means the train must halt at platform 2 of station HIJ for 5 minutes.

## TASK ##
Generate an action plan for each train. The output MUST be a JSON array of objects. Each object must contain:
- "train_id": The train's unique identifier.
- "action": One of "ASSIGN", "HOLD", or "PROCEED".
- "target_node": The destination node for the action (e.g., "P1", "Siding 2").
- "start_time": The start time for the action (HH:MM).
- "end_time": The end time for the action (HH:MM).
- "reasoning": A concise explanation for your decision, explicitly mentioning how the manual override was handled if one was provided.

Think step-by-step to create a conflict-free and optimal plan. Prioritize express trains over freight trains. Minimize delays.
`,
});

const optimizeTrainRoutesFlow = ai.defineFlow(
  {
    name: 'optimizeTrainRoutesFlow',
    inputSchema: OptimizeTrainRoutesInputSchema,
    outputSchema: OptimizeTrainRoutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
