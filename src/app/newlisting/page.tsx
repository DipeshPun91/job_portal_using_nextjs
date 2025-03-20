'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from "@/app/components/Header";
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const NewListing = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const rows = 4;

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    city: '',
    country: '',
    remote: 'no',
    jobType: 'full-time',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  if (status === 'loading') {
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

  if (!session) {
    return <p>User not logged in.</p>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('organization', formData.organization);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('remote', formData.remote);
    formDataToSend.append('jobType', formData.jobType);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('userId', session.user?.id || '');
    if (file) {
      formDataToSend.append('image', file);
    }
  
    const response = await fetch('/api/newlisting', {
      method: 'POST',
      body: formDataToSend,
    });
  
    if (response.ok) {
      toast({
        title: "Job added successfully!",
        description: "Your new job listing has been created.",
        variant: "success",
      });
      router.push('/dashboard');
    } else {
      alert('Failed to add job.');
    }
  };  

  return (
    <div>
      <Header />
      <div className="mx-auto w-full max-w-2xl shadow-md p-6 bg-white rounded-md">
        <h2 className="text-center text-3xl font-bold leading-tight text-black mb-6">
          Add New Job
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">Job Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job Title"
                type="text"
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              />
            </div>
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">Organization Name</label>
              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization Name"
                type="text"
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              />
            </div>
          </div>
          <div>
            <label className="text-base font-medium text-gray-900">Job Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                type="text"
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              />
            </div>
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                type="text"
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">Remote</label>
              <select
                name="remote"
                value={formData.remote}
                onChange={handleChange}
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-base font-medium text-gray-900">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-base font-medium text-gray-900">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description"
              rows={rows}
              className="mt-2 flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
            ></textarea>
          </div>
          <div>
            <button
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
              type="submit"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListing;
