"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { fetchPostSummary } from "@/utils";
import { db } from "../firebase";

const Page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState({ description: "" });
  const [result, setResult] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const reqData = await fetchPostSummary(searchQuery);
    setSearchQuery({ description: "" });
    setResult(reqData.choices);
    setData((prevData) => [...prevData, ...reqData.choices]);
    addDataToFirestore(data);
  };

  const handleInputChange = (event) => {
    setSearchQuery({ ...searchQuery, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const addDataToFirestore = async (data) => {
    try {
      await db.collection("historyData").add({
        data,
      });
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  return (
    <div className="w-[90%] mx-auto mt-10">
      {loading ? (
        <p>Loading....</p>
      ) : user ? (
        <>
          <p> Welcome, {user.displayName} - you are logged in to the profile</p>
          <form onSubmit={handleSearch} className="flex gap-10 mt-8">
            <input
              type="text"
              placeholder="Enter your search query"
              name="description"
              value={searchQuery.description}
              onChange={handleInputChange}
              className="text-black p-2 rounded-md"
            />
            <button
              className="py-1 px-4 bg-white text-black rounded-md font-bold"
              type="submit"
            >
              Search
            </button>
          </form>
          {result && (
            <div className="w-96 min-h-80 mt-12 bg-white text-black p-2 rounded-md">
              {result.map((item, index) => {
                const parts = item.message.content
                  .split("-")
                  .map((part) => part.trim())
                  .filter((part) => part !== "");
                return (
                  <ul className="list-disc ml-5" key={index}>
                    {parts.map((part) => {
                      return <li key={part}>{part}</li>;
                    })}
                  </ul>
                );
              })}
            </div>
          )}
          {data && (
            <div className="mt-10 w-1/2 flex flex-col">
              <h2>Your Search History</h2>
              <ul className="list-decimal">
                {data.map((item, index) => {
                  return (
                    <li key={index} className="my-3">
                      {item.message.content.split("-")}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>You must be logged in to view this page - protected route </p>
      )}
    </div>
  );
};

export default Page;
