'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

type JobRowProps = {
  job: Job;
};

export default function JobRow({ job }: JobRowProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    const response = await fetch(`/api/deletejob/${job._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({
        title: 'Job deleted successfully!',
        description: 'The job listing has been removed.',
        variant: 'success',
      });

      window.location.reload();
    } else {
      toast({
        title: 'Failed to delete job.',
        description: 'There was an issue deleting the job listing.',
        variant: 'destructive',
      });
    }

    setShowConfirm(false);
  };

  return (
    <div className="relative group duration-500 cursor-pointer overflow-hidden text-gray-50 h-72 w-90 rounded-2xl bg-white">
      <Link href={`/job/${job._id}`} className="absolute inset-0">
        <Image
          src={`/uploads/${job.image}`}
          alt="Job Image"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col gap-2 bg-gray-50 text-gray-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lime-400 font-bold text-xs">{job.remote ? 'Remote' : 'On-site'}</span>
          {session && (
            <div className="flex gap-5">
              <div className="flex items-center gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
                <svg className="w-6 h-6 stroke-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <Link
                  href={`/editjob/${job._id}`}
                  className="font-semibold text-sm text-green-700"
                >
                  Edit
                </Link>
              </div>
              <div className="flex items-center gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
                <svg className="w-6 h-6 stroke-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="font-semibold text-sm text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        <span className="font-bold text-xl">{job.title}</span>
        <Link href="#" className="hover:underline text-blue-600 text-sm">{job.organization}</Link>
        <div className="text-gray-600 text-sm">
          {job.city}, {job.country} &middot; {job.jobType}
        </div>
        <div className="text-gray-500 text-xs absolute bottom-0 right-0 mt-6 mr-3">
          {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true }).replace('about ', '')}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[350px] flex flex-col p-4 bg-gray-800 border border-gray-800 shadow-lg rounded-2xl items-center justify-center">
            <div className="text-center p-3 flex-auto justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-600 mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-bold py-4 text-gray-200">Are you sure?</h2>
              <p className="text-sm text-gray-500 px-2">
                Do you really want to delete this job? This process cannot be undone.
              </p>
            </div>
            <div className="flex justify-around items-center py-3 w-full">
              <div className="flex gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
                <svg className="w-6 stroke-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <button onClick={() => setShowConfirm(false)} className="font-semibold text-sm text-green-700">Cancel</button>
              </div>
              <div className="flex gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
                <svg className="w-6 stroke-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <button onClick={handleDelete} className="font-semibold text-sm text-red-700">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
