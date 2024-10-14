import { z } from "zod";

export const email_schema = z.object({
  email: z.string().email(),
});
