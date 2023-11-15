import { Route, Routes } from 'react-router-dom';
import EdaPage from './page/EdaPage';
import ParsingPage from './page/ParsingPage';

function App() {
  return (
    <Routes>
      <Route path={'/'} Component={EdaPage}></Route>
      <Route path={'/parse'} Component={ParsingPage}></Route>
    </Routes>
  );
}

export default App;
