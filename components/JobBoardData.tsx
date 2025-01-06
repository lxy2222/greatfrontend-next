export interface Job {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

async function getJobIds() {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json', {
    cache: "force-cache"
  });
  return res.json();
}

async function getJobDetails(id: number): Promise<Job> {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return res.json();
}

export async function getJobsByPage(page: number = 1): Promise<Job[]> {
  const allJobIds = await getJobIds();
  if (allJobIds.length <= 0) {
    return [];
  } else {
    const jobIds = allJobIds.slice((page - 1) * 10, page * 10);
    try {
      const jobs = await Promise.all(jobIds.map(getJobDetails));
      return jobs;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}