import { cache } from "react";
import { makeQueryClient } from "./query-client";

// One QueryClient per request on the server, shared by the layout and page of that request.
export const getQueryClient = cache(makeQueryClient);
