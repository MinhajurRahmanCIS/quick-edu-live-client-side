import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Module = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const response = await fetch('https://quick-edu-live-server-side.vercel.app/module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      const result = await response.json();
      toast.success('Module created successfully');
      reset();
      navigate("/myhome/mymodule")
    } catch (error) {
      toast.error(`Error creating module: ${error.message}`);
    }
  };

  return (
    <div className="hero min-h-screen">
      <Helmet>
        <title>Create New Course Module</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-5 text-center">Create New Course Module</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Module Topic</span>
            </label>
            <input
              {...register('topic', { required: 'Topic is required' })}
              type="text"
              placeholder="Enter module topic"
              className="input input-bordered"
            />
            {errors.topic && <span className="text-error text-sm mt-1">{errors.topic.message}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Chapters</span>
            </label>
            <input
              {...register('pages', { required: 'Number of chapters is required', min: 1 })}
              type="number"
              placeholder="Enter number of chapters"
              className="input input-bordered"
            />
            {errors.pages && <span className="text-error text-sm mt-1">{errors.pages.message}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tone</span>
            </label>
            <select
              {...register('tone', { required: 'Tone is required' })}
              className="select select-bordered w-full"
            >
              <option value="">Select Tone</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </select>
            {errors.tone && <span className="text-error text-sm mt-1">{errors.tone.message}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Module Description</span>
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter module description"
              className="textarea textarea-bordered h-24"
            />
            {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-neutral">Create Module</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Module;