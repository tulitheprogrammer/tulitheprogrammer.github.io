export const getMarkedDuplicateList = (list) => {
  const buffer = {};
  // const list = JSON.parse(JSON.stringify(arr)) as Array<object>;
  // list.sort((a, b) => {
  //   const aa = a.title.toLowerCase();
  //   const bb = b.title.toLowerCase();
  //   return aa > bb ? 1 : aa < bb ? -1 : 0;
  // });
  const keyGenerator = (item) => {
    const devID = `${item.title.trim()} (${item.numberOfTracks})`;
    return { ...item, devID };
  };

  const markedList = list.map(keyGenerator).reduce((acc, cur, idx, arr) => {
    const alreadyExists = buffer[cur.devID];
    buffer[cur.devID] = true;

    return [...acc, { ...cur, isDuplicate: alreadyExists }];
  }, []);
  return markedList;
};

export const getDuplicates = (list, marked = false) => {
  const markedList = marked ? { ...list } : getMarkedDuplicateList(list);

  return markedList.filter(({ isDuplicate }) => Boolean(isDuplicate));
};
