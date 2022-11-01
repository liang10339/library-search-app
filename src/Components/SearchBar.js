import React, { useState, useEffect } from "react"
import axios from "axios"
import "./SearchBar.css"
import SearchIcon from "@mui/icons-material/Search"
import Spinner from "./Spinner"

function SearchBar({ placeholder }) {
  const library = [
    "新北市立圖書館",
    "臺北市立圖書館",
    "新北HyRead",
    "臺北HyRead",
    "新北UDN",
    "臺北UDN",
  ]
  const storedSearch = JSON.parse(localStorage.getItem("search"))
  const [loading, setLoading] = useState(false)
  const [bookname, setBookname] = useState("")
  const [result, setResult] = useState("")
  const [search, setSearch] = useState(
    storedSearch || new Array(library.length).fill(true)
  )
  useEffect(() => {
    localStorage.setItem("search", JSON.stringify(search))
  }, [JSON.stringify(search)])

  const handleChange = (position) => {
    const updatedCheckedState = search.map((item, index) =>
      index === position ? !item : item
    )
    setSearch(updatedCheckedState)
  }
  const handleClick = (e) => {
    if (e.key === "Enter") postName()
  }
  let libList = []
  library.forEach((lib, index) => {
    libList.push(
      <React.Fragment key={index}>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={search[index]}
              onChange={() => handleChange(index)}
              label={lib}
              key={index}
            />
            {lib}
          </label>
        </div>
      </React.Fragment>
    )
  })

  function postName() {
    // let urlAll = [
    //   `http://localhost:4000/xinbeilib?${bookname}`,
    //   `http://localhost:4000/taipeilib?${bookname}`,
    //   `http://localhost:4000/hyxinbei?${bookname}`,
    //   `http://localhost:4000/hytaipei?${bookname}`,
    //   `http://localhost:4000/udnxinbei?${bookname}`,
    //   `http://localhost:4000/udntaipei?${bookname}`,
    // ]
    let urlAll = [
      `http://library-search.fly.dev/xinbeilib?${bookname}`,
      `http://library-search.fly.dev/taipeilib?${bookname}`,
      `http://library-search.fly.dev/hyxinbei?${bookname}`,
      `http://library-search.fly.dev/hytaipei?${bookname}`,
      `http://library-search.fly.dev/udnxinbei?${bookname}`,
      `http://library-search.fly.dev/udntaipei?${bookname}`,
    ]

    let obj = {}
    let arr = []
    for (let i = 0; i < library.length; i++) {
      arr.push({
        ...obj,
        library: library[i],
        search: search[i],
        url: urlAll[i],
      })
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].search === false) arr[i].url = ""
    }

    let url = arr.map(({ url }) => url).filter((item) => item)

    const getBook = async () => {
      const responses = await Promise.all(
        url.map(async (url) => (await axios.get(url)).data)
      )
      let bookList = JSON.parse(JSON.stringify(responses))
      let tempBook = []
      for (let i = 0; i < bookList.length; i++) {
        bookList[i].shift()
        bookList[i].shift()
        for (let j = 0; j < bookList[i].length; j++) {
          bookList[i][j] = <li>{bookList[i][j]}</li>
        }
      }

      for (let i = 0; i < responses.length; i++) {
        tempBook.push(
          <li className="sgLi" key={i}>
            <div className="box">
              <h3>
                <a href={responses[i][1]} target="_blank" rel="noreferrer">
                  {responses[i][0]}
                </a>
              </h3>
              <ul className="df">{bookList[i]}</ul>
            </div>
          </li>
        )
      }

      setResult(tempBook)
      setLoading(false)
    }
    setLoading(true)
    getBook()
  }

  return (
    <div className="wrap">
      <div className="search">
        <h2>圖書館跨館搜尋</h2>
        <div className="searchInputs">
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => setBookname(e.target.value)}
            onKeyPress={handleClick}
          />
          <div className="searchIcon">
            <SearchIcon onClick={postName} />
          </div>
        </div>
        <div className="liblist">{libList}</div>
      </div>
      <div className="result">
        <div className="X">
          <h3>搜尋結果</h3>
          <span>
            {loading ? <Spinner /> : <ul className="SG">{result}</ul>}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
