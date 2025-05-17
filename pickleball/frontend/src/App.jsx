import callHelloApi from './api/test.js';
import { useEffect, useState } from 'react';
export default function App() {
    const [kq, setKq] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await callHelloApi();
        setKq(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setKq('Lỗi khi gọi API');
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <h1>Hello from React + Vite!</h1>
      <h2>API Response:</h2>
      <p>{kq}</p>
    </div>
  );
}
