'use client';
import { useEffect, useState } from 'react';
import JobRow from "@/app/components/JobRow";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationContent
} from "@/components/ui/pagination";

type Job = {
  _id: string;
  title: string;
  organization: string;
  image: string;
  city: string;
  country: string;
  remote: boolean;
  jobType: 'full-time' | 'part-time';
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalJobs, setTotalJobs] = useState<number>(0); 
  const jobsPerPage = 6; 

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(`/api/jobs?page=${currentPage}&limit=${jobsPerPage}`);
        const data = await response.json();
        if (data.jobs) {
          setJobs(data.jobs); 
          setTotalJobs(data.total); 
        } else {
          console.error('Failed to fetch jobs:', data.error);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [currentPage]); 

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex-col gap-4 flex items-center justify-center">
          <div
            className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-green-600 rounded-full"
          >
            <div
              className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-cyan-600 rounded-full"
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-3xl mb-6 text-gray-800">Recent Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobRow key={job._id} job={job} />)
          ) : (
            <p>No job postings found for your account.</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              href="#"
            />
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                    href="#"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && <PaginationEllipsis />}
            </PaginationContent>
            <PaginationNext
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              href="#"
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
}
