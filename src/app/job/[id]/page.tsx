'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import Header from "@/app/components/Header";
import { formatDistance } from 'date-fns';

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

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchJob() {
      const response = await fetch(`/api/job/${id}`);
      const data = await response.json();
      if (response.ok) {
        setJob(data);
      } else {
        toast({
          title: 'Error fetching job',
          description: data.message || 'Unable to fetch job details.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }
    fetchJob();
  }, [id]);

  const formatDescription = (description: string) => {
    const lines = description.split('\n').map(line => line.trim()).filter(line => line);
    
    const formattedLines = lines.map((line, index) => {
      if (line.endsWith(':')) {
        return <h3 key={index} className="font-semibold text-lg text-gray-800 mt-4">{line}</h3>;
      }

      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc text-gray-700">{line.substring(2)}</li>;
      } else if (/^\d+\./.test(line)) {
        return <li key={index} className="ml-4 list-decimal text-gray-700">{line}</li>;
      }

      return <p key={index} className="text-gray-700 mb-2">{line}</p>;
    });

    return <div className="leading-relaxed">{formattedLines}</div>;
  };

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

  if (!job) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-lg text-gray-500">Job not found!</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-3xl shadow-lg p-8 bg-white rounded-lg border border-gray-200">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-4">{job.title}</h2>
        <div className="flex items-start mb-6 border-b pb-4">
          {job.image ? (
            <img
              src={`/uploads/${job.image}`}
              alt={job.title}
              className="w-40 h-40 object-cover rounded-md shadow-lg mr-4"
              onError={() => console.error('Image failed to load')}
            />
          ) : (
            <div className="w-40 h-40 border border-gray-300 rounded-md flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          <div className="ml-4">
            <p className="font-semibold text-xl text-gray-800">{job.organization}</p>
            <p className="text-gray-600">{job.city}, {job.country}</p>
            <p className="text-gray-500">{job.remote ? 'Remote' : 'On-site'} | {job.jobType}</p>
          </div>
        </div>
        <div className="mb-4 text-lg leading-relaxed">
          {formatDescription(job.description)}
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Posted {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true }).replace('about ', '')}
        </p>
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Back to Listings
          </button>
        </div>
      </div>
    </>
  );
}
