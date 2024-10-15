import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const SummaryStats = () => {
  const { user } = useAuth(); // Get current user
  const [stats, setStats] = useState({
    totalTime: 0,
    activeProjects: 0,
    totalEarnings: 0,
    clientCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch the summary data from the API route
      fetch(`/api/stats?userId=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user || loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-lightNeutral shadow-md rounded-lg p-6 text-center dark:bg-darkAccent">
        <h3 className="text-lg font-semibold text-neutral dark:text-background">
          Total Time Tracked
        </h3>
        <p className="text-2xl font-bold text-primary dark:text-secondary">
          {stats.totalTime / 60} hours
        </p>
      </div>
      <div className="bg-lightNeutral shadow-md rounded-lg p-6 text-center dark:bg-darkAccent">
        <h3 className="text-lg font-semibold text-neutral dark:text-background">
          Active Projects
        </h3>
        <p className="text-2xl font-bold text-primary dark:text-secondary">
          {stats.activeProjects}
        </p>
      </div>
      <div className="bg-lightNeutral shadow-md rounded-lg p-6 text-center dark:bg-darkAccent">
        <h3 className="text-lg font-semibold text-neutral dark:text-background">
          Total Earnings
        </h3>
        <p className="text-2xl font-bold text-primary dark:text-secondary">
          ${stats.totalEarnings}
        </p>
      </div>
      <div className="bg-lightNeutral shadow-md rounded-lg p-6 text-center dark:bg-darkAccent">
        <h3 className="text-lg font-semibold text-neutral dark:text-background">
          Clients
        </h3>
        <p className="text-2xl font-bold text-primary dark:text-secondary">
          {stats.clientCount}
        </p>
      </div>
    </div>
  );
};

export default SummaryStats;
