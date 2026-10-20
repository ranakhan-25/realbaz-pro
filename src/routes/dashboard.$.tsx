import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { isModuleKey, moduleLabel } from "@/lib/menus";

export const Route = createFileRoute("/dashboard/$")({
  head: ({ params }) => {
    const [first = ""] = params._splat?.split("/") ?? [];
    const mod = isModuleKey(first) ? moduleLabel(first) : "Dashboard";
    return { meta: [{ title: `${mod} — RealBiz Dashboard` }] };
  },
  component: ModuleRoute,
});

function ModuleRoute() {
  const { _splat = "" } = Route.useParams();
  const [first = "", ...rest] = _splat.split("/").filter(Boolean);
  const module = isModuleKey(first) ? first : "project";
  return <ModulePage module={module} path={rest.join("/")} />;
}
