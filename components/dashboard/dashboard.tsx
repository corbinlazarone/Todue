
interface DashboarCompProps {
  isSidebarOpen?: boolean;
}

export default function DashboarComp({
  isSidebarOpen = true,
}: DashboarCompProps) {
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSidebarOpen ? "pl-4" : "pl-0"
      }`}
    >
      <div className="max-w-7xl mx-auto pr-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your stats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
