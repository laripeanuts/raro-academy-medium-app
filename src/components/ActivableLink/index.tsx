import { Link, LinkProps, useMatch } from "react-router-dom";

type ActivableLinkProps = LinkProps & { type?: "link" | "button" };

export const ActivableLink: React.FC<ActivableLinkProps> = (props) => {
  const { type } = props;
  const match = useMatch(props.to.toString());
  const underlineClass = "border-[#44c2fd] border-b-2";
  const isButton = type === "button";

  return (
    <Link
      className={match && !isButton ? `${underlineClass}` : ""}
      {...props}
    />
  );
};
