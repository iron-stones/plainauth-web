import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: number;
}

export function Loading(props: Props) {
  const { className, size = 36 } = props;

  const style = {
    width: size,
    height: size,
  };

  return (
    <div
      className={cn(
        "border-[3px] border-dashed rounded-full animate-spin border-primary",
        className
      )}
      style={style}></div>
  );
}
Loading.displayName = "Loading";
