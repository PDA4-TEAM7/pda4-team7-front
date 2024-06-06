import { ShinhanApi, IStockData } from '@/apis/shinhanAPI';
import useSWR from 'swr';

//테스트용 페이지
export default function Dev() {
  const service = new ShinhanApi();
  const { data, isLoading } = useSWR<IStockData[]>(`shinhanRecommend`, () => service.getRecommendPortfolio());
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      page
      <div>{data && data.map((item) => <div>{item.stbdName}</div>)}</div>
    </div>
  );
}
