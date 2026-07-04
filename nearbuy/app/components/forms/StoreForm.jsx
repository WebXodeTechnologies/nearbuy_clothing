"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const AVAILABLE_LOCATIONS = [
  { value: "Indiranagar, Bangalore", label: "Indiranagar, Bangalore" },
  { value: "Commercial Street, Bangalore", label: "Commercial Street, Bangalore" },
  { value: "Koramangala, Bangalore", label: "Koramangala, Bangalore" },
  { value: "Jayanagar, Bangalore", label: "Jayanagar, Bangalore" },
  { value: "MG Road, Bangalore", label: "MG Road, Bangalore" }
];

const CATEGORIES_LIST = [
  "Men's Wear",
  "Women's Wear",
  "Kids Wear",
  "Ethnic Wear",
  "Boutique",
  "Footwear",
  "Accessories"
];

export default function StoreForm({ initialData = {}, onSubmit }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [location, setLocation] = useState(initialData.location || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || "");
  const [hours, setHours] = useState(initialData.hours || "10:00 AM - 09:00 PM");
  const [logo, setLogo] = useState(initialData.logo || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&h=200&q=80");
  const [banner, setBanner] = useState(initialData.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80");
  const [mapEmbedUrl, setMapEmbedUrl] = useState(initialData.mapEmbedUrl || "");
  const [selectedCategories, setSelectedCategories] = useState(initialData.categories || []);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (selectedCategories.length === 0) {
      setMessage("Please select at least one category.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setMessage("Store details saved successfully!");
      if (onSubmit) {
        onSubmit({
          name,
          description,
          location,
          address,
          phone,
          whatsapp,
          hours,
          logo,
          banner,
          mapEmbedUrl,
          categories: selectedCategories
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 text-xs rounded-lg border ${
          message.includes("successfully")
            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
            : "text-red-600 bg-red-50 border-red-100"
        }`}>
          {message}
        </div>
      )}

      {/* Visual Banners */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-gray-700">Store Media Previews</span>
        <div className="relative border border-gray-150 rounded-xl overflow-hidden bg-gray-50 h-40">
          <img src={banner} alt="Banner Preview" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 h-16 w-16 border-2 border-white bg-white rounded-xl shadow-md overflow-hidden">
            <img src={logo} alt="Logo Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-md font-medium">
            Demo Assets Linked
          </div>
        </div>
      </div>

      {/* Basic details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Store Name"
          name="name"
          placeholder="e.g. Urban Threads Boutique"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Select
          label="Neighborhood Location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          options={AVAILABLE_LOCATIONS}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-700">Store Description</label>
        <textarea
          rows={3}
          placeholder="Describe your collections, custom tailoring services, designer drops..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm block border border-gray-250 rounded-lg p-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          required
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 block">Clothing Categories Offered</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES_LIST.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <button
                type="button"
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Contact Number"
          name="phone"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="WhatsApp Business Number"
          name="whatsapp"
          placeholder="919876543210 (include country code)"
          helperText="Used for customer quick chats"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
        />
        <Input
          label="Operational Hours"
          name="hours"
          placeholder="e.g. 10:30 AM - 09:30 PM"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Store Logo Image URL"
          name="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          required
        />
        <Input
          label="Store Banner Image URL"
          name="banner"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          required
        />
      </div>

      {/* Address & Maps */}
      <div className="space-y-4">
        <Input
          label="Complete Physical Address"
          name="address"
          placeholder="Flat number, building, street, land-mark, city, PIN code"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Input
          label="Google Maps Embed URL"
          name="mapEmbedUrl"
          placeholder="https://www.google.com/maps/embed?pb=..."
          helperText="Go to Google Maps -> Share -> Embed Map -> Copy iframe src link only"
          value={mapEmbedUrl}
          onChange={(e) => setMapEmbedUrl(e.target.value)}
        />
      </div>

      <div className="pt-2 flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading} className="px-6">
          Save Store Profile
        </Button>
      </div>
    </form>
  );
}
