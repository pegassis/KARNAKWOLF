import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'motion/react';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F2ED] to-[#EFEAE3]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-8 h-8 text-[#C65D3B]" />
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/karmin" replace />;
  }

  return <>{children}</>;
}
