// components/StatisticCard.tsx

type StatisticCardProps = {
  label: string;
  value: string;
};

const StatisticCard: React.FC<StatisticCardProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-md m-2">
      <span className="text-xl font-medium text-white">{value}</span>
      <span className="text-lg font-medium text-gray-400">{label}</span>
    </div>
  );
};

export default StatisticCard;
