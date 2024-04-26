import React, { useState } from "react";

function DictionaryApp() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const fetchApi = async (word) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const result = await response.json();

      if (result.title) {
        setErrorMessage(
          `Can't find the meaning of "${word}". Please, try to search for another word.`
        );
      } else {
        const data = result[0];
        const definitions = data.meanings[0].definitions[0];

        setMeaning(definitions.definition);
        setExample(definitions.example);
        setSynonyms(definitions.synonyms.slice(0, 5));

        const audioUrl = `https:${data.phonetics[0].audio}`;
        setAudio(new Audio(audioUrl));
      }
    } catch (error) {
      setErrorMessage(
        `Can't find the meaning of "${word}". Please, try to search for another word.`
      );
    }

    setLoading(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && word.trim() !== "") {
      fetchApi(word.trim());
    }
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  const handleClear = () => {
    setWord("");
    setMeaning("");
    setExample("");
    setSynonyms([]);
    setErrorMessage("");
    setAudio(null);
  };

  return (
    <div className="wrapper">
      <header>English Dictionary</header>
      <div className="search">
        <input
          type="text"
          placeholder="Search a word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyPress={handleSearch}
          disabled={loading}
        />
        <i className="fas fa-search"></i>
        <span className="material-icons" onClick={handleClear}>
          Close
        </span>
      </div>
      <p className="info-text">
        {loading
          ? "Loading..."
          : errorMessage ||
            "Type any existing word and press enter to get meaning, example, synonyms, etc."}
      </p>
      <ul>
        <li className="word">
          <div className="details">
            <span>{word ? "Pronunciation not found" : ""}</span>
          </div>
          <i className="fas fa-volume-up" onClick={playAudio}></i>
        </li>
        <div className="content">
          <li className="meaning">
            <div className="details">
              <p>Meaning</p>
              <span>{meaning}</span>
            </div>
          </li>
          <li className="example">
            <div className="details">
              <p>Example</p>
              <span>{example}</span>
            </div>
          </li>
          <li className="synonyms">
            <div className="details">
              <p>Synonyms</p>
              <div className="list">
                {synonyms.map((synonym, index) => (
                  <span key={index} onClick={() => setWord(synonym)}>
                    {synonym}
                    {index === synonyms.length - 1 ? "" : ","}
                  </span>
                ))}
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default DictionaryApp;
