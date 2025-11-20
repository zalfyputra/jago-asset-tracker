'use client';
import { useState } from 'react';
import { useEffect } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    serialnumber: '',
    category: '',
    brand: '',
    series: '',
    screen: '',
    processor: '',
    memory: '',
    storage: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setSuccess(true);
      setFormData({
        name: '', serialnumber: '', category: '', brand: '', series: '', screen: '', processor: '', memory: '', storage: ''
      });
      console.log(setFormData);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fields = Object.entries(formData);

  return (
    <section>
      <div className="flex flex-col bg-[#53005C] items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-4xl xl:p-0">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mb-5">
              Register
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900 capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full text-black bg-[#FCBD53] hover:bg-[#DFA749] transition duration-300 ease-in-out focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Register Asset
              </button>
              <p className="text-sm text-center text-gray-500">
                Already registered your device? <a href="/" className="text-blue-600 hover:underline">Check here</a>
              </p>
            </form>

            {success && (
              <div className="text-green-600 text-center font-medium">
                Asset registered successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}