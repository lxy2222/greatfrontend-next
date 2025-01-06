'use client';

import * as React from "react";
import { Job } from "../JobBoardData";
 
export default function JobBoard({ getJobAction }: { getJobAction : (page: number) => Promise<Job[]> }) {
  const [page, setPage] = React.useState(1);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  React.useEffect(() => {
    const fetchJobs = async() => {
      const data = await getJobAction(page);
      setJobs(jobs => jobs.concat(data));
    }
    fetchJobs();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Hacker News Job Board</h1>
      {jobs && jobs.length > 0 && (
         <div className="space-y-4">
          {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h2 className="text-xl font-semibold text-blue-600 hover:underline">{job.title}</h2>
                    <div className="mt-2 text-gray-600">
                      <span>Posted by {job.by}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(job.time * 1000).toLocaleDateString()}</span>
                    </div>
                  </a>
                </div>
             ))}
          </div>
      )}
      <button
        type="button"
        onClick={() => setPage(page => page + 1)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
       Load more jobs
      </button>
    </div>
    
  );
}
