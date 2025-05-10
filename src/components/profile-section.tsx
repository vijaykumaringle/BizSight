'use client';

import { useState } from 'react';

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save changes here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <section className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          {isEditing ? (
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your Name" defaultValue="John Doe" />
          ) : (
            <p className="text-gray-800">John Doe</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          {isEditing ? (
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your Email" defaultValue="john.doe@example.com" />
          ) : (
            <p className="text-gray-800">john.doe@example.com</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          {isEditing ? (
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" placeholder="Your Phone" defaultValue="555-555-5555" />
          ) : (
            <p className="text-gray-800">555-555-5555</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          {isEditing ? (
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="address" type="text" placeholder="Your Address" defaultValue="123 Main St, Anytown, USA" />
          ) : (
            <p className="text-gray-800">123 Main St, Anytown, USA</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          {isEditing ? (
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Your Country" defaultValue="USA" />
          ) : (
            <p className="text-gray-800">USA</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">

        {isEditing ? (
          // Show Save and Cancel buttons when editing
          <div className="flex space-x-4">
            <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Save
            </button>
            <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
          </div>
        ) : (
          // Show Edit button when not editing
          <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Edit Profile
          </button>

        )}
      </div>
    </section>
  );
}