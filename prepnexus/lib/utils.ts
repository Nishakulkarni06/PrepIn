import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export const getCompanyLogo = (company?: string) => {
  if (!company || typeof company !== "string") {
    return "/covers/default.png";
  }

  const key = company.toLowerCase().trim();
  return `/covers/${key}.png`;
};

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

export async function fetchYouTubeResources(query: string, maxResults = 3) {
  const baseUrl = "https://www.googleapis.com/youtube/v3/search";

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    key: YOUTUBE_API_KEY,
    maxResults: maxResults.toString(),
    type: "video",
    safeSearch: "strict",
  });

  const res = await fetch(`${baseUrl}?${params}`);
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((item: any) => ({
    title: item.snippet.title,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    description: item.snippet.description,
  }));
}