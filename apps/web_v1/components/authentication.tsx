"use client";

import axios from "axios";
import { useState } from "react";
import dotenv from "dotenv";
dotenv.config();

interface AuthenticationProps {
    authMode: 'login' | 'signup';
  }
  

const Authentication: React.FC<AuthenticationProps> =  ({ authMode }) => {
    const [formData, setFormData] = useState({
      username: '',
      firstName: '',
      lastName: '',
      password: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${authMode}`;
 
      try {       
          if (authMode === 'login') {
            const response = await axios.post(url , {
                username : formData.username,
                password : formData.password
            });
            console.log('Signin up in with:', { username: formData.username}, response);

          } else {
            const response = await axios.post(url , {
                username : formData.username,
                firstName : formData.firstName,
                lastName : formData.lastName,
                password : formData.password
            });
            console.log('Logging in with:', { username: formData.username}, response);
          }

      } catch (error) {
        console.log("Error caught")
      }


    };
  
    return (
      <div className="flex h-screen">

        <div className="hidden md:flex w-3/4 bg-gradient-to-br from-blue-800 to-blue-700 items-center justify-center p-10 shadow-2xl">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4">ShareDraw ✒️</h1>
            <p className="text-sm -ml-6">Experience the beautiful magic on your canvas.</p>
          </div>
        </div>

        <div className="flex w-full md:w-1/2 items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>
              {authMode === 'signup' && (
                <>
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="hover:cursor-pointer w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-white transition duration-300 hover:text-black hover:ring-2"
              >
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <div className="text-center mt-4">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="text-blue-700 hover:underline">
                    Sign up here
                  </a>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-700 hover:underline">
                    Login here
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Authentication;