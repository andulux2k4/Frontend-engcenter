import { FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { MdOutlineApps } from 'react-icons/md';
import ProfileModal from './modals/ProfileModal';

function TeacherOverview({ user, showProfileModal, setShowProfileModal, onGoHome, onLogout }) {
  return (
    <header className="dashboard-header">
      <h1>
        <FiUser className="icon" />
        Giáo viên
      </h1>
      <div className="user-info">
        <span>Xin chào, {user?.name}</span>
      </div>
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      )}
    </header>
  );
}

export default TeacherOverview;
