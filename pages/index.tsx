import GameOfLife from '../components/GameOfLife';

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <GameOfLife />
    </div>
  );
}