import React, { useCallback, useEffect, useRef, useState } from 'react';

function ScrollContainer(props) {
  const { param, getData, renderListItem, resultData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const page = useRef(1);
  const observer = useRef(null);
  const lastElementObserver = useCallback((node) => {
    if(isLoading) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        page.current = page.current + 1;
        fetchData();
      }
    });
    if(node) observer.current.observe(node);
  })

  const renderList = useCallback(() => {
    return (
      resultData.map((item, index) => {
        if(index === resultData.length - 1) return renderListItem(item, index, lastElementObserver)
        return renderListItem(item, index, null);
      })
    )
  })

  const fetchData = useCallback(() => {
    setIsLoading(true);
    getData(param, page.current)
    .finally(() => {
      setIsLoading(false);
    })
  }, [param])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {renderList()}
      {
        isLoading && <div>Loading...</div>
      }
    </div>
  )
}

export default ScrollContainer;