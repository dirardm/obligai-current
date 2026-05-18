/**
 * Tag — jurisdiction, framework or domain label chip.
 *
 * @example
 * <Tag variant="jurisdiction">EU</Tag>
 * <Tag variant="framework">CRR II</Tag>
 */

import { forwardRef } from "react";

type TagVariant = "jurisdiction" | "framework" | "domain";

interface TagProps extends React.ComponentPropsWithoutRef<"span"> {
  variant: TagVariant;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant, className = "", children, ...props }, ref) => {
    const cls = ["tag", `tag-${variant}`, className].filter(Boolean).join(" ");
    return (
      <span ref={ref} className={cls} {...props}>
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";
export default Tag;
