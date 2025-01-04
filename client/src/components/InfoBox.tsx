export function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="infoBox">
      <i className={icon}></i>
      <p>{label}</p>
      <p className="placeholder">{value}</p>
    </div>
  );
}
