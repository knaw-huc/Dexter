import { getSources } from "../Components/API";

export async function doGetSources() {
  const response = await getSources();
  return response;
}
