import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArticleTable = () => {
  const [sortedArr, setSortedArr] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const authors = [...new Set(sortedArr.map(article => article.author))];

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  }

  const myFilter = (arr, callback) => {
    const filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (callback(arr[i])) {
        filteredArr.push(arr[i]);
      }
    }
    return filteredArr;
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get('/db.json');
        setSortedArr(data.articles);
      } catch (error) {
        console.error(error)
      }
    };

    fetchArticles();
  }, [])

  const sortByProperty = (arr, prop) => {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = sortByProperty(left, prop);
    const sortedRight = sortByProperty(right, prop);

    const merged = [];
    let leftIdx = 0;
    let rightIdx = 0;
    while (leftIdx < sortedLeft.length && rightIdx < sortedRight.length) {
      if (sortedLeft[leftIdx][prop] < sortedRight[rightIdx][prop]) {
        merged.push(sortedLeft[leftIdx]);
        leftIdx++;
      } else {
        merged.push(sortedRight[rightIdx]);
        rightIdx++;
      }
    }
    return merged.concat(sortedLeft.slice(leftIdx)).concat(sortedRight.slice(rightIdx));
  }

  const onClickId = () => {
    setSortedArr(sortByProperty(sortedArr, "id"));
  }

  const onClickTitle = () => {
    setSortedArr(sortByProperty(sortedArr, "title"));
  }

  const onClickDescription = () => {
    setSortedArr(sortByProperty(sortedArr, "description"));
  }

  const onClickAuthor = () => {
    setSortedArr(sortByProperty(sortedArr, "author"));
  }

  return (
    <div>
      <label htmlFor="author-filter">Filter by author:</label>
      <select id="author-filter" value={selectedAuthor} onChange={handleAuthorChange}>
        <option value="">All authors</option>
        {authors.map(author => (
          <option key={author} value={author}>{author}</option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th onClick={onClickId}>ID</th>
            <th onClick={onClickTitle}>Title</th>
            <th onClick={onClickDescription}>Description</th>
            <th onClick={onClickAuthor}>Author</th>
          </tr>
        </thead>
        <tbody>
          {myFilter(sortedArr, article => !selectedAuthor || article.author === selectedAuthor).map(article => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.description}</td>
              <td>{article.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;