/**
 * Resolved community config — parsed through Zod with defaults applied.
 * Import this instead of community.config.ts directly in preview components.
 */

import rawConfig from "@/community.config";
import { CommunityConfigSchema } from "@/schema";

const parsed = CommunityConfigSchema.parse(rawConfig);
export default parsed;
