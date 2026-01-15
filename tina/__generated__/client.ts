import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '8c5279d3ed6a87638d45ed378bd82130ef6beb86', queries,  });
export default client;
  