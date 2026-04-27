import ChildView from "./ChilView";

export default async function Page({ params }: any) {
  const { id } = await params;

  console.log("ENTREI AQUI!------", id)



  return <ChildView id={id} />;
}