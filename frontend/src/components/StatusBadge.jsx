export default function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'Applied':
        return 'badge-applied';
      case 'Shortlisted':
        return 'badge-shortlisted';
      case 'Interviewed':
        return 'badge-interviewed';
      case 'Rejected':
        return 'badge-rejected';
      case 'Hired':
        return 'badge-hired';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {status}
    </span>
  );
}
