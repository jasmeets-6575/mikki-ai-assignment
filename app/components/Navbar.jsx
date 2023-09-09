import Link from "next/link";
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="h-16 w-full border-b-2 flex items-center justify-between p-2">
      <ul className="flex">
        <li className="p-2">
          <Link href="/">Home</Link>
        </li>
        <li className="p-2">
          <Link href="/about">About</Link>
        </li>
        <li className="p-2">
          <Link href="/profile">Profile</Link>
        </li>
      </ul>

      {loading ? null : !user ? (
        <ul className="flex">
          <li onClick={handleSignIn} className="p-2 cursor-pointer">
            Login
          </li>
        </ul>
      ) : (
        <div className="flex items-center">
          <p>Welcome, {user.displayName}</p>
          <p onClick={handleSignOut} className=" ml-7 cursor-pointer">
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
