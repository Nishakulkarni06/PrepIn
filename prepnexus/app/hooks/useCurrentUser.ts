import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/me"); // <-- create this API route
      if (res.ok) {
        const userData = await res.json();
        console.log("Current user data:", userData);
        setUser(userData);
      }
    };

    getUser();
  }, []);

  return user;
};
