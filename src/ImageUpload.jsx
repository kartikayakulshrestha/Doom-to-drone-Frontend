import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { imageupdates } from "./app/reducer_action";
const ImageUpload = () => {
  const [imageName, setImageName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageURL(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleURLChange = (e) => {
    setImageURL(e.target.value);
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let da = { imageName: imageName, imageURL: imageURL };
    dispatch(imageupdates(da));

    let res = await axios.post(
      "https://doom-to-drone-backend.vercel.app/imageupload",
      da,
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    if (res.data.message) {
      navigate("/editor");
    }

    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">
        Upload Your Image Here
      </h1>
      <form
        className="bg-gray-700 p-6 rounded shadow-md animate-fade-in-up"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="imageName" className="block mb-2">
            Image Name
          </label>
          <input
            type="text"
            id="imageName"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageFile" className="block mb-2">
            Upload Image
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageURL" className="block mb-2">
            Or Enter Image URL
          </label>
          <input
            type="url"
            id="imageURL"
            value={imageURL}
            onChange={handleURLChange}
            className="w-full p-2 rounded bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        {imagePreview && (
          <div className="mb-4">
            <label className="block mb-2">Image Preview</label>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded shadow-md"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 mt-4 bg-gray-900 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        >
          Go to Editor
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;
