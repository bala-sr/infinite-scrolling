import { useCallback, useState, useRef } from 'react';
import './App.css';
import ScrollContainer from './ScrollContainer';

function App() {
  const [param, setParam] = useState("");
  const [data, setData] = useState([]);
  const controllerRef = useRef(null);
  
  const changeParam = useCallback((e) => {
    setParam(e.target.value);
  }, []);

  const renderItem = useCallback(({title}, key, ref) => {
    return (
      <div ref={ref} key={key}>{ title }</div>
    )
  });
  
  const getData = useCallback((param, page) => {
    return new Promise(async (resolve, reject) => {
      try {
        if(controllerRef.current) {
          controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const promise = await fetch(`https://openlibrary.org/search.json?q=${param}&page=${page}`, { signal: controllerRef.current.signal });
        const data = await promise.json();
        setData(prev => [...prev, ...data.docs]);
        resolve();
        console.log(data);
      } catch(error) {
        console.log(error);
        reject();
      }
    })
  }, []);

  return (
    <div className="App">
      <input type="text" value={param} onChange={changeParam} />
      <ScrollContainer 
      renderListItem={renderItem}
      getData={getData}
      resultData={data}
      param={param}
      />
    </div>
  )
}

export default App;
