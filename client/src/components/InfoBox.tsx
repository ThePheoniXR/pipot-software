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
      <img src={icon} />
      <br /> <br />
      <p className="infop">{label}</p>
      <p className="placeholder">{value}</p>
    </div>
  );
}