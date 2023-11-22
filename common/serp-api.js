import {getJson} from 'serpapi';

export async function search(query) {
  return getJson({
    q: query,
    // location: 'Warsaw, Poland',
    hl: 'pl',
    gl: 'pl',
    google_domain: 'google.pl',
    api_key: process.env.SERP_API_API_KEY,
  });

}
