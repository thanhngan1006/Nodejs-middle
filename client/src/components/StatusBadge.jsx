const StatusBadge = ({ status }) => {
  let color = "";
  if (status === "Active") {
    color = "bg-green-100 text-green-800 border-green-300";
  } else if (status === "Inactive") {
    color = "bg-red-100 text-red-800 border-red-300";
  } else {
    color = "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${color}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
