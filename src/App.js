import './App.css';
import FullOrdered from './pages/full_ordered';
import OrderedList from './pages/ordered_list';

function App() {
  return (
    <div className="App flex border">
      <section className='w-[50%]'><OrderedList /></section>
      <div className="divider"></div> {/* 구분선 추가 */}
      <section className='w-[50%]'><FullOrdered /></section>
    </div>
  );
}

export default App;
