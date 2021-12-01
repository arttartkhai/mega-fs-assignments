const InfoBox = ({ title, data, ...props }) => (
  <div
    className="flex items-center justify-center p-3 border-2 border-pink-300 rounded-xl text-center"
    {...props}
  >
    <div className="p-3 font-bold text-sm px-3 bg-green-100 text-teal-800 rounded-xl">
      {title}
    </div>
    <div className="ml-3">{data}</div>
  </div>
);

export default InfoBox;
