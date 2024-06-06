import { ShinhanApi, IStockData } from '@/apis/shinhanAPI';
import useSWR from 'swr';
import useModal from '@/hooks/useModal';
import IconHeart from '@/assets/icon-heart.svg?react';

//테스트용 페이지
export default function Dev() {
  const service = new ShinhanApi();
  const { data, isLoading } = useSWR<IStockData[]>(`shinhanRecommend`, () => service.getRecommendPortfolio());
  const { open, close } = useModal();
  const handleModal = () => {
    open('title', '이런식으로 모달을 사용하면 됩니다.', close);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>test page</p>
      <p>
        <span> svg 넣기 :</span>
        <IconHeart width={100} height={100} fill={'#2cffd1'} stroke={'#2cffd1'} />
      </p>
      <button className="btn border m-2 p-1" onClick={handleModal}>
        모달 버튼
      </button>
      <div>{data && data.map((item) => <div>{item.stbdName}</div>)}</div>
    </div>
  );
}
