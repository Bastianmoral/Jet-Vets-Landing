import cloud1 from "../assets/cloud.webp";
import cloud2 from "../assets/cloud_2.webp";

export default function TitleWithClouds({ children, as = "h2", className = "" }) {
  const Tag = as;
  return (
    <div className="relative inline-block">
      <Tag className={`relative z-10 ${className}`}>{children}</Tag>
      <img
        src={cloud1}
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute -top-6 -left-20 w-28 pointer-events-none select-none"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        className="hidden sm:block absolute -bottom-6 -right-20 w-28 pointer-events-none select-none"
      />
    </div>
  );
}
