export interface CrustdataCompanyRaw {
  id?: string;
  name?: string;
  company_name?: string;
  domain?: string;
  website?: string;
  description?: string;
  industry?: string;
  taxonomy?: { industry?: string };
  headquarters?: { country?: string; city?: string };
  categories?: string[];
  linkedin_url?: string;
}

export interface CrustdataPersonRaw {
  name?: string;
  full_name?: string;
  title?: string;
  current_title?: string;
  current_company?: string;
  email?: string;
  work_email?: string;
  linkedin_url?: string;
}

export interface NormalizedCompany {
  id: string;
  name: string;
  domain: string;
  description: string;
  industry: string;
  location: string;
  source_url: string;
  raw: any;
}

export interface NormalizedPerson {
  name: string;
  title: string;
  email: string | null;
  linkedin_url: string | null;
  verified: boolean;
  role_family: string;
}

export class CrustdataError extends Error {
  statusCode: number;
  endpoint: string;
  constructor(message: string, statusCode: number, endpoint: string) {
    super(message);
    this.name = "CrustdataError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

const CRUSTDATA_BASE_URL = "https://api.crustdata.com";
const API_VERSION = "2025-11-01";

/**
 * Fetch wrapper with 1 bounded backoff retry for 429 / 5xx responses
 */
async function callCrustdataApi(
  endpoint: string,
  payload: Record<string, any>,
  apiKey: string
): Promise<any> {
  const url = `${CRUSTDATA_BASE_URL}${endpoint}`;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "x-api-version": API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxAttempts) {
          // Bounded backoff: wait 1500ms before single retry
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
      }

      const errorText = await response.text().catch(() => "Unknown error");
      throw new CrustdataError(
        `Crustdata API returned HTTP ${response.status}: ${errorText.slice(0, 200)}`,
        response.status,
        endpoint
      );
    } catch (err: any) {
      if (err instanceof CrustdataError) {
        throw err;
      }
      if (attempt === maxAttempts) {
        throw new CrustdataError(
          `Network / connection failure contacting Crustdata: ${err?.message || "Unknown"}`,
          503,
          endpoint
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Search companies in Crustdata by keyword, industry, and country
 */
export async function searchCrustdataCompanies(
  query: string,
  country: string = "India",
  limit: number = 5,
  apiKey?: string
): Promise<NormalizedCompany[]> {
  const key = apiKey || process.env.CRUSTDATA_API_KEY;
  if (!key) {
    throw new Error("CRUSTDATA_API_KEY is not configured in server environment.");
  }

  const payload = {
    filters: {
      op: "and",
      conditions: [
        {
          field: "keyword",
          type: "(.)",
          value: query,
        },
        ...(country && country !== "All"
          ? [
              {
                field: "headquarters.country",
                type: "=",
                value: country,
              },
            ]
          : []),
      ],
    },
    limit: Math.min(limit, 10),
  };

  const response = await callCrustdataApi("/company/search", payload, key);

  // Parse results from array or response wrapper
  const rawList: any[] = Array.isArray(response)
    ? response
    : response?.results || response?.data || response?.companies || [];

  return rawList.map((item: CrustdataCompanyRaw, idx: number): NormalizedCompany => {
    const name = item.company_name || item.name || `Company-${idx + 1}`;
    const domain = (item.domain || item.website || `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`)
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
    const description = item.description || "Technology / Manufacturing enterprise.";
    const industry = item.taxonomy?.industry || item.industry || "Hardware & Manufacturing";
    const loc = item.headquarters
      ? `${item.headquarters.city ? item.headquarters.city + ", " : ""}${item.headquarters.country || country}`
      : country;

    return {
      id: item.id || `crust_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`,
      name,
      domain,
      description,
      industry,
      location: loc,
      source_url: `https://${domain}`,
      raw: item,
    };
  });
}

/**
 * Search for partnership / university relations contacts for a company
 */
export async function searchCrustdataCompanyContact(
  companyName: string,
  apiKey?: string
): Promise<NormalizedPerson | null> {
  const key = apiKey || process.env.CRUSTDATA_API_KEY;
  if (!key) return null;

  try {
    const payload = {
      filters: {
        op: "and",
        conditions: [
          {
            filter_type: "current_company",
            type: "in",
            value: [companyName],
          },
          {
            filter_type: "current_title",
            type: "(.)",
            value: "Partnership",
          },
        ],
      },
      page: 1,
    };

    const response = await callCrustdataApi("/person/search", payload, key);
    const rawList: any[] = Array.isArray(response)
      ? response
      : response?.results || response?.data || response?.people || [];

    if (rawList.length > 0) {
      const person: CrustdataPersonRaw = rawList[0];
      const name = person.full_name || person.name;
      const title = person.current_title || person.title || "Partnership Coordinator";
      const email = person.work_email || person.email || null;

      if (name) {
        return {
          name,
          title,
          email,
          linkedin_url: person.linkedin_url || null,
          verified: Boolean(email),
          role_family: "Partnerships / Business Development",
        };
      }
    }
  } catch {
    // Contact search is best-effort (Blueprint page 5, 8); failure is not fatal
  }

  return null;
}
