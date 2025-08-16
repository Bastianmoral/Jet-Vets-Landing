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
        className="absolute -top-3 -left-6 w-16 sm:-top-6 sm:-left-20 sm:w-28 pointer-events-none select-none"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        className="absolute -bottom-3 -right-6 w-16 sm:-bottom-6 sm:-right-20 sm:w-28 pointer-events-none select-none"
      />
    </div>
  );
}
