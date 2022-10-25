import styles from './App.module.css';
import HomePage from '../HomePage/HomePage';
import SearchPage from '../SearchPage/SearchPage';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/page/:pageNumber' element={<HomePage />}/>
        <Route path='/search' element={<SearchPage />}/>
        <Route path='*' element={<h1 className={styles.notFound}>404 not found</h1>} />
      </Routes>
    </div>
  );
}