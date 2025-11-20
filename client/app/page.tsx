// app/page.tsx (Asset Serial Check Page)
'use client';
import { useState } from 'react';
import Logo from './jago.png'

export default function Home() {
  const [serial, setSerial] = useState('');
  const [asset, setAsset] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const checkSerial = async () => {
    const res = await fetch(`/api?serial=${serial}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.asset) {
        setAsset(data.asset);
        setNotFound(false);
      } else {
        setAsset(null);
        setNotFound(true);
      }
    }
  };

  return (
    <section>
      <div className="flex flex-col bg-[#53005C] items-center justify-center px-6 py-8 mx-auto min-h-screen md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <img src={Logo.src} className="w-1/2 mx-auto" />
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Asset Tracker
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => { e.preventDefault(); checkSerial(); }}>
              <div>
                <label htmlFor="serial" className="block mb-2 text-sm font-medium text-gray-900">Serial Number</label>
                <input
                  type="text"
                  name="serial"
                  id="serial"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter your device serial number..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-black bg-[#FCBD53] hover:bg-[#DFA749] transition duration-300 ease-in-out focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Check
              </button>
              <p className="text-sm text-center text-gray-500">
                Didn't find your device? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
              </p>
            </form>

            {asset && (
              <div className="border p-4 rounded bg-green-100 text-left text-black">
                <p><strong>Name:</strong> {asset.name}</p>
                <p><strong>Category:</strong> {asset.category}</p>
                <p><strong>Serial number:</strong> {asset.serialnumber}</p>
              </div>
            )}

            {notFound && (
              <div className="text-red-500 text-center">
                <p>Serial number not found. Please register your device.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}