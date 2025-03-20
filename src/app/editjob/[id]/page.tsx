'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import Header from "@/app/components/Header";

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

export default function EditJobPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<Job>({
    _id: '',
    title: '',
    organization: '',
    image: '',
    city: '',
    country: '',
    remote: false,
    jobType: 'full-time',
    description: '',
    createdAt: '',
    updatedAt: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const rows = 4;

  useEffect(() => {
    async function fetchJob() {
      const response = await fetch(`/api/job/${id}`);
      const data = await response.json();
      setJob(data);
      setFormData(data);
    }
    fetchJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let imageName = formData.image;
    
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile); 
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
  
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        imageName = uploadResult.fileName;
      } else {
        toast({
          title: 'Failed to upload image.',
          description: 'There was an issue uploading the image.',
          variant: 'destructive',
        });
        return;
      }
    }
  
    const response = await fetch(`/api/updatejob/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, image: imageName }),
    });
  
    if (response.ok) {
      toast({
        title: 'Job updated successfully!',
        description: 'The job listing has been updated.',
        variant: 'success',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Failed to update job.',
        description: 'There was an issue updating the job listing.',
        variant: 'destructive',
      });
    }
  };   
  
  if (!job) {
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
    <>
      <Header />
      <div className="mx-auto w-full max-w-2xl shadow-md p-6 bg-white rounded-md">
        <h2 className="text-center text-3xl font-bold leading-tight text-black mb-6">Edit Job</h2>
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
            <div className="mt-2 mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Job Image Preview"
                  className="w-32 h-32 object-cover rounded-md"
                  onError={() => console.error('Image failed to load')}
                />
              ) : formData.image ? (
                <img
                  src={`/uploads/${formData.image}`}
                  alt="Job Image"
                  className="w-32 h-32 object-cover rounded-md"
                  onError={() => console.error('Image failed to load')}
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
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
                value={formData.remote ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, remote: e.target.value === 'yes' })}
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
              Update Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
