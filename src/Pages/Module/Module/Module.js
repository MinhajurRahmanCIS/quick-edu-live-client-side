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
      const response = await fetch('http://localhost:5000/module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      // const result = await response.json();
      toast.success('Module created successfully');
      reset();
      navigate("/myhome/mymodule");
    } catch (error) {
      toast.error(`Error creating module: ${error.message}`);
    }
  };

  return (
    <div className="hero min-h-screen">
      <Helmet>
        <title>Create Course Module</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-5 text-center">Create Course Module</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Name</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Enter Course Name"
              className="input input-bordered"
            />
            {errors.name && <span className="text-error text-sm mt-1">{errors.name.message}</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Level</span>
            </label>
            <select
              {...register('level', { required: 'Level is required' })}
              className="select select-bordered w-full"
            >
              <option selected disabled>Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              {/* <option value="advance">Advance</option> */}
            </select>
            {errors.level && <span className="text-error text-sm mt-1">{errors.level.message}</span>}
          </div>

          {/* <div className="form-control">
            <label className="label">
              <span className="label-text">Module Description</span>
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter module description"
              className="textarea textarea-bordered h-24"
            />
            {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
          </div> */}

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-neutral">Create Module</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Module;