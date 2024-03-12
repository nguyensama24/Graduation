import { useState } from "react";
import { Products } from "../../filterPage/FiltersPage";

export default function Description() {
  const [first, setfirst] = useState<Products | undefined>(undefined);

  return (
    <div
      className="px-[113px] py-[78px] text-sm break-all"
      dangerouslySetInnerHTML={{ __html: first?.description as any }}
    ></div>
  );
}
