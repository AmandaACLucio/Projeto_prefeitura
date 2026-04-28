import ChildView from "./ChilView";

export default async function Page({ params }: any) {
  const { id } = await params;

  return <ChildView id={id} />;
}