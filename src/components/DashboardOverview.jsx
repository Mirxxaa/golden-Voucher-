// src/components/DashboardOverview.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Users, Award, TrendingUp } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    eligibleUsers: 0,
    totalMeals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);

        let totalUsers = 0;
        let eligibleUsers = 0;
        let totalMeals = 0;

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          totalUsers++;

          const mealsCount = userData.meals?.length || 0;
          totalMeals += mealsCount;

          if (mealsCount >= 6) {
            eligibleUsers++;
          }
        });

        setStats({
          totalUsers,
          eligibleUsers,
          totalMeals,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6 flex items-center"
    >
      <div
        className={`rounded-full w-12 h-12 flex items-center justify-center ${color}`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          title="Total Users"
          value={loading ? "..." : stats.totalUsers}
          color="bg-blue-500"
        />

        <StatCard
          icon={Award}
          title="Eligible Users"
          value={loading ? "..." : stats.eligibleUsers}
          color="bg-green-500"
        />

        <StatCard
          icon={TrendingUp}
          title="Total Meals Recorded"
          value={loading ? "..." : stats.totalMeals}
          color="bg-indigo-500"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
