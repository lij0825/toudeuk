export default function Page({ params }: { params: { id: number } }) {
  return <div>{params.id}회차 결과</div>;
}
