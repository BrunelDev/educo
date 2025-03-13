export default function ConsultationTitle({
  title,
  barNumber,
}: {
  title: string;
  barNumber: number;
}) {
  return (
    <div className="w-[255px] bg-[#FFFFFF99] rounded-[8px] py-3 px-2 flex justify-between">
      <h6 className="font-semibold text-sm">{title}</h6>
      <div className="flex gap-[3px] mt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <>
            {i < barNumber ? (
              <div key={"bar" + _} className="w-[2px] h-4 rounded-full bg-coral-400"></div>
            ) : (
              <div key={"bar" + _} className="w-[2px] h-4 rounded-full bg-white-400"></div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
